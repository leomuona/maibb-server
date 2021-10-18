package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/julienschmidt/httprouter"
	"github.com/leomuona/maibb-server/auth"
)

type MessageResponse struct {
	Message string `json:"message"`
}

func InitAuth() *auth.JwtAuth {
	return &auth.JwtAuth{
		SecretKey:         "topsekretlulz",
		Issuer:            "MaiBB",
		ExpirationMinutes: 30,
	}
}

func Hello(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	w.Header().Set("Content-Type", "application/json")
	msg := MessageResponse{
		Message: "Hello world!",
	}
	json.NewEncoder(w).Encode(msg)
}

func Login(jwtAuth *auth.JwtAuth) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
		token, _ := jwtAuth.CreateToken("pekka", []string{"ADMIN", "USER"})
		msg := MessageResponse{
			Message: "Bearer " + token,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(msg)
	}
}

func Secret(w http.ResponseWriter, r *http.Request, _ httprouter.Params) {
	token := r.Context().Value("token").(*auth.AppClaims)
	roles := strings.Join(token.Roles, ", ")
	msg := MessageResponse{
		Message: "Topsecret place, hi " + token.User + "! " + roles,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(msg)
}

func main() {
	jwtAuth := InitAuth()

	router := httprouter.New()
	router.GET("/", Hello)
	router.GET("/login", Login(jwtAuth))
	router.GET("/secret", jwtAuth.Middleware(Secret))

	log.Println("starting server on port 8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
