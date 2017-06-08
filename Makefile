SRC = $(wildcard src/*.js)
LIB = $(SRC:src/%.js=lib/%.js)

lib: $(LIB)
lib/%.js: src/%.js .babelrc
	mkdir -p $(@D)
	babel $< -o $@

msg-all:
	curl -k -XPOST https://soma.uni-koblenz.de/fcm/msg/all

msg-some:
	curl -k -XPOST -H Content-Type: application/json -d {[197,199]} https://soma.uni-koblenz.de/fcm/msg/all
