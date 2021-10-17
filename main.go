package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/leomuona/maibb-server/auth"
)

func main() {
	jwtWrapper := auth.JwtWrapper{
		SecretKey:       "topsekretlulz",
		Issuer:          "AuthService",
		ExpirationHours: 24,
	}
	generatedToken, err := jwtWrapper.GenerateToken("kikki.hiiri@gov.fi")
	if err != nil {
		return
	}
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Token: %s", generatedToken)
	})
	log.Println("starting server on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
