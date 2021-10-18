package auth

import (
	"context"
	"net/http"
	"strings"

	"github.com/julienschmidt/httprouter"
)

func (j *JwtAuth) Middleware(next httprouter.Handle) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			// no token
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized"))
			return
		}

		authHeaderParts := strings.Fields(authHeader)
		if len(authHeaderParts) != 2 || strings.ToLower(authHeaderParts[0]) != "bearer" {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Authorization header format must be Bearer {token}"))
			return
		}

		jwtToken := authHeaderParts[1]
		claims, err := j.ValidateToken(jwtToken)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("Unauthorized"))
			return
		}

		ctx := r.Context()
		ctx = context.WithValue(ctx, "token", claims)
		r = r.WithContext(ctx)
		next(w, r, ps)
	}
}
