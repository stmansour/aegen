DIST=dist
DIRS=sh elems
.PHONY: test

vidmaker:
	for dir in $(DIRS); do make -C $$dir;done

clean:
	for dir in $(DIRS); do make -C $$dir clean;done
	rm -rf dist

test:
	for dir in $(DIRS); do make -C $$dir test;done

package:
	for dir in $(DIRS); do make -C $$dir package;done

all: clean vidmaker package
	@echo "Completed"
