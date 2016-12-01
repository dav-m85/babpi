#ifndef MAIN_H_
#define MAIN_H_

typedef enum {
	STATE_BUTTON_DOWN,
	STATE_BUTTON_UP,
	RESET_PENDING,
	RESET,
	IDLE,
	SLEEP
} State;

void init(void);
void init_tx(void);
void init_radio(void);
void init_nrf(void);
void init_buttons(void);
void start_button_timer(void);
void stop_button_timer(void);
void nrf_init_radio(void);
#endif /* MAIN_H_ */
