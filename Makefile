.PHONY: server build og

server:
	python3 -m http.server

build:
	python3 scripts/build.py

og:
	python3 scripts/og.py
