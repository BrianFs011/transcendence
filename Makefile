# Variables
CHROME_EXISTS = $(shell find /usr/bin -name '*chrome*' 2>/dev/null)
EDGE_EXISTS = $(shell find /usr/bin -name '*edge*' 2>/dev/null)
NONE =

all: chrome edge build

# Colors
GREEN	= \e[32m
BLUE	= \e[34m
MAGENTA	= \e[35m
CYAN	= \e[36m
RESET	= \e[0m

# Chrome target
chrome:
	@if [ -z "$(CHROME_EXISTS)" ]; then \
		echo -e $(GREEN)"Installing Chrome..."$(RESET); \
		wget -c https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb; \
		sudo apt install -y ./google-chrome-stable_current_amd64.deb || echo $(MAGENTA)"Keeping existing Chrome installation"$(RESET); \
	else \
		echo $(GREEN)"Chrome is already installed!"$(RESET); \
	fi

# Edge target
edge:
	@if [ -z "$(EDGE_EXISTS)" ]; then \
		echo $(BLUE)"Installing Edge..."$(RESET); \
		wget -O edge.deb 'https://go.microsoft.com/fwlink?linkid=2149051&brand=M102'; \
		sudo apt install -y ./edge.deb || echo $(CYAN)"Keeping existing Edge installation"$(RESET); \
	else \
		echo $(BLUE)"Edge is already installed!"$(RESET); \
	fi

# Remove browsers
remove_chrome:
	sudo apt remove -y google-chrome-stable

remove_edge:
	sudo apt remove -y microsoft-edge-stable

# Build project
build:
	@if [ -e ./application/certs/localhost.key ] && ! [ -r ./application/certs/localhost.key ]; then sudo chmod +r ./application/certs/localhost.key; fi
	@clear
	@docker-compose up -d --build

.PHONY:	all build chrome edge remove_chrome remove_edge
