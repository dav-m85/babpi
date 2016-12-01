#ifndef NRF24_H_
#define NRF24_H_

#define NRF_IRQ     BIT2
#define NRF_CE      BIT0


//NRF24L01 COMMAND SUBSET
#define NRF_READ	     0b00000000
#define NRF_WRITE	     0b00100000
#define NRF_NOOP	     0b11111111
#define NRF_TX		     0b10100000
#define NRF_R_PAYLOAD    0b11000001
#define NRF_TX_NACK      0xb0
#define NRF_FLUSH_TX     0b11100001
//NRF24L01 REGISTERS
#define NRF_CONFIG       0x00
#define NRF_EN_AA        0x01
#define NRF_EN_RXADDR    0x02
#define NRF_SETUP_AW     0x03
#define NRF_SETUP_RETR   0x04
#define NRF_RF_CH        0x05
#define NRF_RF_SETUP     0x06
#define NRF_STATUS       0x07
#define NRF_OBSERVE_TX   0x08
#define NRF_RX_ADDR_P0   0x0a
#define NRF_TX_ADDR      0x10
#define NRF_RX_PW_P0     0x11
#define NRF_FIFO_STATUS  0x17

#define NRF_CONFIG_RADIO 0b00000010
#define NRF_STAT_TX_FULL 0b00100000
#define NRF_TX_DS        0b00100000
#define NRF_MAX_RETRIES  0b00010000

void nrf_init(char*, int);
void nrf_init_radio(void);
void nrf_set_config(char);
void set_address(char *, int);
void nrf_set_channel(void);
void nrf_write(char addr, char data);
char nrf_read(char data);
void nrf_tx(char data);
char nrf_rx(void);
void radio_on(void);
void radio_off(void);
char nrf_get_status(void);
void nrf_flush_tx(void);
void nrf_ceh(void);
void nrf_cel(void);
#endif /* NRF24_H_ */
