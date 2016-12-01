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

//LSB first
char nrf_address[5] = {
	0x34,
	0x00,
	0x00,
	0x00,
	0x00
};

State state = IDLE;

/**
 * Main routine
 */
int main(void)
{
  	init();

	while (1) {
		switch (state) {

			case STATE_BUTTON_DOWN:
				__delay_cycles(2000); // Soft debounce
				start_button_timer();

				// @todo deal here with multi press

				sendThis = pressedButtons;

				// P2OUT &= ~BUTTON_1; // Debug by using an output with a led

				// Let's wait for button up
				state = IDLE;
				break;

			case STATE_BUTTON_UP:
				__delay_cycles(2000); // Soft debounce
				stop_button_timer();

				// P2OUT |= BUTTON_1; // Debug by using an output with a led

				// Add press time to payload
				sendThis |= button_press_time<<4;

				// 1 timer cycle (0.5s @1MHz)

				nrf_tx(sendThis);

				button_press_time = 0;
				pressedButtons    = 0;

				// mmm
				state = SLEEP;
				break;

			case IDLE:
				// enter LPM with timer
				_bis_SR_register(LPM0);
				nrf_cel();
				spi_csl();
				break;

			case SLEEP:
				// enter LPM no timer
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
	//set up interrupt for NRF
    P2DIR  &= ~NRF_IRQ;
    //clear interrupt flag
    P2IFG  &= ~NRF_IRQ;
    //interrupt on high to low transition
    P2IES  |= NRF_IRQ;
    //enable interrupt for NRF
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
    CCR0 =  62500; //0.5 sec @ID_3
	TACTL = TASSEL_2 + MC_1 + ID_3;

	// P2OUT |= BUTTON_1; // Debug by using an output with a led
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

//RX interrupt OR closed contacts in TX mode
#pragma vector=PORT2_VECTOR
__interrupt void Port_2(void) {
	char nrfState;
	if( P2IFG & BIT2 ) {
		nrfState = nrf_get_status();
		if(nrfState & NRF_STAT_TX_FULL) {
			nrf_write(NRF_STATUS,nrfState|NRF_TX_DS);
		} else if(nrfState & NRF_MAX_RETRIES)  {
			nrf_write(NRF_STATUS,nrfState|NRF_MAX_RETRIES);
			nrf_set_channel();
			nrf_flush_tx();
		}
		P2IFG &= ~BIT2;
		return;
	}

	LPM0_EXIT;
	LPM4_EXIT;

	// Store interruptedButton and clear flags
	char interruptedButton = P2IFG & buttons;

	// Set state according transition, and toggle edge detection direction
	if( interruptedButton & P2IES ) {
		state = STATE_BUTTON_DOWN;
		P2IES &= ~interruptedButton; // 0 - Set low to high interruption
		pressedButtons |= interruptedButton;
	} else {
		state = STATE_BUTTON_UP;
		P2IES |= interruptedButton; // 1 - Set high to low interruption
		pressedButtons &= ~interruptedButton;
	}

	// Clear flags
	P2IFG &= ~buttons;
}

//button timer
#pragma vector=TIMER0_A0_VECTOR
__interrupt void button_time(void) {
	button_press_time++;
}
