#include <msp430.h>

#include "spi.h"

#define SCLK    BIT5
#define SOMI    BIT6
#define SIMO    BIT7
#define CS      BIT0

void spi_init(void) {

	UCB0CTL1 = UCSWRST;
    P1DIR  |= CS;
    P1OUT  |= CS;
    P1SEL  |= SOMI + SIMO + SCLK;
  	P1SEL2 |= SOMI + SIMO + SCLK;
    UCB0CTL0 |= UCCKPH + UCMSB + UCMST + UCSYNC;
	UCB0CTL1 |= UCSSEL_2;   // SMCLK
	UCB0CTL1 &= ~UCSWRST;
	spi_csh();
}

void spi_csh(void) {
    P1OUT |= CS;
}

void spi_csl(void) {
    P1OUT &= ~CS;
}

char spi_send(char data) {
  	UCB0TXBUF = data;
	while (!(IFG2 & UCB0TXIFG));
	return UCB0RXBUF;
}

void spi_send_buffer(char *data, unsigned int size) {
	int i;
	for( i = 0; i < size; i++ ) {
	  	UCB0TXBUF = *(data+i);
		while (!(IFG2 & UCB0TXIFG));
	}
}
