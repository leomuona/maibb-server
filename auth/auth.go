package auth

import (
	"time"

	"github.com/golang-jwt/jwt"
)

// TODO: separation with access and refresh tokens for nice auth things

type JwtAuth struct {
	SecretKey                string
	Issuer                   string
	ExpirationMinutes        int64
	RefreshExpirationMinutes int64
}

func (j *JwtAuth) GenerateTokenPair(accessClaims AppClaims, refreshClaims RefreshClaims) (string, string, error) {
	access, err := j.CreateAppToken(accessClaims)
	if err != nil {
		return "", "", err
	}
	refresh, err := j.CreateRefreshToken(refreshClaims)
	if err != nil {
		return "", "", err
	}
	return access, refresh, nil
}

func (j *JwtAuth) CreateAppToken(claims AppClaims) (signedToken string, err error) {
	claims.IssuedAt = time.Now().Local().Unix()
	claims.ExpiresAt = time.Now().Local().Add(time.Minute * time.Duration(j.ExpirationMinutes)).Unix()
	claims.Issuer = j.Issuer

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err = token.SignedString([]byte(j.SecretKey))
	if err != nil {
		return
	}

	return
}

func (j *JwtAuth) CreateRefreshToken(claims RefreshClaims) (signedToken string, err error) {
	claims.IssuedAt = time.Now().Local().Unix()
	claims.ExpiresAt = time.Now().Local().Add(time.Minute * time.Duration(j.RefreshExpirationMinutes)).Unix()
	claims.Issuer = j.Issuer

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	signedToken, err = token.SignedString([]byte(j.SecretKey))
	if err != nil {
		return
	}

	return
}
