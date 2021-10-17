package main

import (
	"log"
	"net/http"
)

func hello(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"message":"Hello World"}`))
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", hello)
	log.Println("starting server on port 8080")
	log.Fatal(http.ListenAndServe(":8080", mux))
}
