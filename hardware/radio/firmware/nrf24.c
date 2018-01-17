#include <msp430.h>
#include "nrf24.h"
#include "spi.h"

#define CONFIG     0x0e // PTX, PWR_UP, CRC 2bytes, EN_CRC
#define EN_AA      0x01 // ENAA_P0 => auto ack data pipe 0
#define EN_RXADDR  0x01 // ERX_P0 => data pipe 0 in reception mode
#define SETUP_RETR 0x00 // re transmit disabled
#define CHANNEL    0x49 // select channel
#define RF_SETUP   0x27 // RF_PWR=0dBm, RF_DR_HIGH=1, PLL_LOCK=0, RF_DR_LOW=0 (250kbps)

void nrf_init(char *address, int address_size) {
  	P2DIR |= NRF_CE;
  	P2OUT |= NRF_CE;
	//auto ack pipe 0
	nrf_write(NRF_EN_AA, EN_AA);
	//pipe 0 only
	nrf_write(NRF_EN_RXADDR, EN_RXADDR);
	//set channel
	nrf_set_channel();
	//setup RF
	nrf_write(NRF_RF_SETUP,RF_SETUP);
	set_address(address,address_size);
}

void nrf_init_radio(void) {
    nrf_write(NRF_SETUP_RETR, SETUP_RETR); //no auto retransmit
	nrf_write(NRF_CONFIG, CONFIG);
    radio_off();
}

void set_address(char *address, int address_size) {
	spi_csl();
	spi_send(NRF_WRITE | NRF_TX_ADDR);
	spi_send_buffer(address, address_size);
    spi_csh();
    spi_csl();
	spi_send(NRF_WRITE | NRF_RX_ADDR_P0);
	spi_send_buffer(address, address_size);
	spi_csh();
}

char nrf_read( char address ) {
	char tmp;
	spi_csl();
	spi_send(NRF_READ | address);
	tmp = spi_send(NRF_NOOP);
	spi_csh();
	return tmp;
}

void nrf_write(char address, char data) {
	spi_csl();
	spi_send(NRF_WRITE | address);
    spi_send(data);
    spi_csh();
}

void send_command(char command) {
	spi_csl();
	spi_send(command);
	spi_csh();
}

void nrf_tx(char data) {
	char tmp = nrf_read(NRF_FIFO_STATUS);
	if(tmp & NRF_STAT_TX_FULL) {
		return;
	}
	radio_on();
	spi_csl();
	spi_send(NRF_TX);
	spi_send(data);
	spi_csh();
	nrf_ceh();
	//start transmission (pulse CE > 10us)
	__delay_cycles(20);
	nrf_cel();
	__delay_cycles(1000);
	radio_off();
}

char nrf_rx() {
	char tmp;
	spi_csl();
	spi_send(NRF_R_PAYLOAD);
	tmp = spi_send(NRF_NOOP);
	spi_csh();
	return tmp;
}

void radio_on(void) {
	char tmp = nrf_read(NRF_CONFIG);
	nrf_write(NRF_CONFIG, tmp|NRF_CONFIG_RADIO);
	//wait a little for radio to power up
	__delay_cycles(2000);
}

void radio_off(void) {
	char tmp = nrf_read(NRF_CONFIG);
	nrf_write(NRF_CONFIG, tmp&(~NRF_CONFIG_RADIO&0xff));
}

void nrf_set_config(char config) {
	nrf_write(NRF_CONFIG, config);
}

void nrf_flush_tx(void) {
	send_command(NRF_FLUSH_TX);
}

void nrf_set_channel(void) {
	nrf_write(NRF_RF_CH, CHANNEL);
}

char nrf_get_status(void) {
	return nrf_read(NRF_STATUS);
}

char nrf_get_fifo_status(void) {
	return nrf_read(NRF_FIFO_STATUS);
}

void nrf_ceh(void)
{
	P2OUT |= NRF_CE;
}

void nrf_cel(void)
{
	P2OUT &= ~NRF_CE;
}

