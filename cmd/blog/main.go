package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

const (
	port         = ":3001"
	dbDriverName = "mysql"
)

func openDB() (*sql.DB, error) {
	return sql.Open(dbDriverName, "root:root@tcp(localhost:3306)/blog")
}

func main() {
	db, err := openDB()
	if err != nil {
		log.Fatal(err)
	}

	dbx := sqlx.NewDb(db, dbDriverName)

	mux := mux.NewRouter()

	mux.HandleFunc("/", homeHandler(dbx))
	mux.HandleFunc("/home", homeHandler(dbx))
	mux.HandleFunc("/index", homeHandler(dbx))
	mux.HandleFunc("/post/{post_id}/{title}", postHandler(dbx))
	mux.HandleFunc("/login", loginHandler)
	mux.HandleFunc("/admin", adminHandler(dbx))

	mux.HandleFunc("/api/post", publishPost(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/login", loginUser(dbx)).Methods(http.MethodPost)
	mux.HandleFunc("/api/logout", logoutUser).Methods(http.MethodPost)
	mux.HandleFunc("/api/", publishPost(dbx)).Methods(http.MethodPost)

	mux.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("./static"))))

	log.Println("Start server http://localhost" + port)
	log.Fatal(http.ListenAndServe(port, mux))
}
