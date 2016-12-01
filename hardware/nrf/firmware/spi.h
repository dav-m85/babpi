#ifndef __SPI_H
#define __SPI_H

void spi_init(void);

void spi_csh(void);

void spi_csl(void);

char spi_send(char data);

void spi_send_buffer(char *data, unsigned int size);

#endif
