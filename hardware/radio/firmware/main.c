#include <msp430.h>
#include "main.h"
#include "nrf24.h"
#include "spi.h"

#define BUTTON_1       BIT3
#define BUTTON_2       BIT4

// Managed by the Interrupt Vector. Carry current buttons state.
unsigned int pressedButtons = 0;
unsigned int sendThis = 0;
unsigned int button_press_time = 0;
unsigned char buttons;
volatile unsigned char interruptButton = 0;

//LSB first
char nrf_address[5] = {
	0x34,
	0x00,
	0x00,
	0x00,
	0x00
};

volatile State state = IDLE;

/**
 * Main routine
 */
int main(void)
{
  	init();

	// Transmission format is 0baaaa00bb
	// where aaaa is press time (each bit is 0.5s), and the last two bits bb correspond to which button is pressed

	while (1) {
		switch (state) {

			case STATE_BUTTON_DOWN:
				__delay_cycles(2000); // Soft debounce
				start_button_timer(); // Transmission is sent only on button up
				P2IES &= ~interruptButton; // 0 - Set low to high transition (listen for button up)
				pressedButtons |= interruptButton; // Allows for multi-button press
				sendThis = pressedButtons >> 3; // Shift to first two bits
				state = IDLE;
				break;

			case STATE_BUTTON_UP:
				__delay_cycles(2000); // Soft debounce
				stop_button_timer();

				// Disable interrupt while shifting transition direction (listen for button down)
				P2IE  &= ~interruptButton;
				P2IES |= interruptButton;
				P2IFG &= ~interruptButton;
				P2IE  |= interruptButton;

				// Add press time to payload, shift out of the way of actual button
				sendThis |= button_press_time<<4;

				nrf_tx(sendThis);

				button_press_time = 0;
				pressedButtons    = 0;
				interruptButton   = 0;

				state = SLEEP;
				break;

			case IDLE:
				nrf_cel();
				spi_csl();
				break;

			case SLEEP:
				// Enter LPM no timer
				_bis_SR_register(LPM4);
				nrf_cel();
				spi_csl();
				break;
		}
	}
}

void init(void) {
	// Set main clock, watchdog timer off
    WDTCTL  = WDTPW | WDTHOLD;
	BCSCTL1 = CALBC1_1MHZ;
  	DCOCTL  = CALDCO_1MHZ;

    button_press_time = 0;
    pressedButtons    = 0;
    buttons = BUTTON_1 | BUTTON_2;

  	// Set all pins as digital low output
	P1SEL = P2SEL = P3SEL = 0x00;
	P1DIR = P2DIR = P3DIR = 0xff;
	P1OUT = P2OUT = P3OUT = 0x00;

    // Enable global interrupt
    _bis_SR_register( GIE );

	spi_init();
	init_nrf();
	init_buttons();
	init_tx();
}

void init_tx(void) {
	nrf_init_radio();
    state = SLEEP;
}

void init_nrf(void) {
    // Set up interrupt for NRF
    P2DIR  &= ~NRF_IRQ;
    // Clear interrupt flag
    P2IFG  &= ~NRF_IRQ;
    // Interrupt on high to low transition
    P2IES  |= NRF_IRQ;
    // Enable interrupt for NRF
    P2IE   |= NRF_IRQ;
    nrf_init(nrf_address, sizeof(nrf_address));
}

void init_buttons(void) {
	// Confiugure buttons as input
	P2SEL  &= ~buttons;
	P2SEL2 &= ~buttons;
    P2DIR  &= ~buttons;
    P2OUT  |= buttons;
	
    // Enable pull-up resistors
    P2REN  |= buttons;
    
    // Interrupt on hi->low transition
	P2IES  |= buttons;
	P2IFG  &= ~buttons;
    P2IE   |= buttons;

    // Timer configuration for button duration detection
    // 1 timer cycle (0.5s @1MHz / ID_3)
    CCR0 =  30000;
    TACTL = TASSEL_2 + MC_1 + ID_3;
}

void start_button_timer() {
	TACCTL0 &= ~CCIE;
	TAR = 0;
	_EINT();
	TACCTL0 = CCIE;
}

void stop_button_timer(void) {
	TACCTL0 &= ~CCIE;
}

// Button press or TX FIFO is full / unacked
#pragma vector=PORT2_VECTOR
__interrupt void Port_2(void) {
	char nrfState;
	if( P2IFG & BIT2 ) {
		nrfState = nrf_get_status();
		if(nrfState & NRF_STAT_TX_FULL) {
			nrf_write(NRF_STATUS,nrfState|NRF_TX_DS);
		} else if(nrfState & NRF_MAX_RETRIES)  {
			nrf_write(NRF_STATUS,nrfState|NRF_MAX_RETRIES);
			nrf_flush_tx();
		}
		// Clear interrupt flag
		P2IFG &= ~BIT2;
		return;
	}

	LPM4_EXIT;

	// Store interruptButton and clear flags
	interruptButton = P2IFG & buttons;

	// Check which edge triggered the interrupt, and set state accordingly
	if( interruptButton & P2IES ) {
		state = STATE_BUTTON_DOWN;
	} else {
		state = STATE_BUTTON_UP;
	}

	// Clear iterrupt flag
	P2IFG &= ~interruptButton;
}

// Button timer
#pragma vector=TIMER0_A0_VECTOR
__interrupt void button_time(void) {
	// If the button is pressed long enough, immediately trigger
	// the long button press event so the user doesn't have to guess how long to press.
	// Corresponding code in receiver must by synchronised with this timing
	stop_button_timer();
	button_press_time = 2;
	state = STATE_BUTTON_UP;
}
