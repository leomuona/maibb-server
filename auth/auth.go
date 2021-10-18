package auth

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/google/uuid"
)

type JwtAuth struct {
	SecretKey         string
	Issuer            string
	ExpirationMinutes int64
}

type AppClaims struct {
	ID    uuid.UUID `json:"id,omitempty"`
	User  string    `json:"user,omitempty"`
	Roles []string  `json:"roles,omitempty"`
	jwt.StandardClaims
}

func (j *JwtAuth) CreateToken(user string, roles []string) (signedToken string, err error) {
	tokenID, err := uuid.NewRandom()
	if err != nil {
		return
	}

	claims := &AppClaims{
		ID:    tokenID,
		User:  user,
		Roles: roles,
		StandardClaims: jwt.StandardClaims{
			IssuedAt: time.Now().Local().Unix(),
			ExpiresAt: time.Now().Local().Add(
				time.Minute * time.Duration(j.ExpirationMinutes),
			).Unix(),
			Issuer: j.Issuer,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err = token.SignedString([]byte(j.SecretKey))
	if err != nil {
		return
	}

	return
}

func (j *JwtAuth) ValidateToken(signedToken string) (claims *AppClaims, err error) {
	token, err := jwt.ParseWithClaims(
		signedToken,
		&AppClaims{},
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(j.SecretKey), nil
		},
	)

	if err != nil {
		return
	}

	claims, ok := token.Claims.(*AppClaims)
	if !ok {
		err = errors.New("couldn't parse claims")
		return
	}

	if claims.ExpiresAt < time.Now().Local().Unix() {
		err = errors.New("token is expired")
		return
	}

	return
}

func (j *JwtAuth) RefreshToken(oldSignedToken string) (newSignedToken string, err error) {
	oldToken, err := j.ValidateToken(oldSignedToken)

	if err != nil {
		return
	}

	claims := &AppClaims{
		ID:    oldToken.ID,
		User:  oldToken.User,
		Roles: oldToken.Roles,
		StandardClaims: jwt.StandardClaims{
			IssuedAt: time.Now().Local().Unix(),
			ExpiresAt: time.Now().Local().Add(
				time.Minute * time.Duration(j.ExpirationMinutes),
			).Unix(),
			Issuer: j.Issuer,
		},
	}

	newToken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	newSignedToken, err = newToken.SignedString([]byte(j.SecretKey))
	if err != nil {
		return
	}

	return
}
