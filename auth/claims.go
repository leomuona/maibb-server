package auth

import (
	"errors"

	"github.com/golang-jwt/jwt"
)

type AppClaims struct {
	ID    int      `json:"id,omitempty"`
	Roles []string `json:"roles,omitempty"`
	jwt.StandardClaims
}

func (c *AppClaims) ParseAppClaims(claims jwt.MapClaims) error {
	id, ok := claims["id"]
	if !ok {
		return errors.New("could not parse claim id")
	}
	c.ID = int(id.(float64))

	rl, ok := claims["roles"]
	if !ok {
		return errors.New("could not parse claims roles")
	}

	var roles []string
	if rl != nil {
		for _, v := range rl.([]interface{}) {
			roles = append(roles, v.(string))
		}
	}
	c.Roles = roles

	return nil
}

type RefreshClaims struct {
	ID    int    `json:"id,omitempty"`
	Token string `json:"token,omitempty"`
	jwt.StandardClaims
}

func (c *RefreshClaims) ParseClaims(claims jwt.MapClaims) error {
	token, ok := claims["token"]
	if !ok {
		return errors.New("could not parse claim token")
	}
	c.Token = token.(string)
	return nil
}
