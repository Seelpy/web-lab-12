package main

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"html/template"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/jmoiron/sqlx"
)

const authCookieName = "authCookieName"

func homeHandler(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		featuredPosts, err := getFeaturedPosts(db)
		for index, post := range featuredPosts {
			post.URLTitle = strings.ReplaceAll(post.Title, " ", "-")
			featuredPosts[index] = post
		}
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		mostRecentPosts, err := getMostRecentPosts(db)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		for index, post := range mostRecentPosts {
			post.URLTitle = strings.ReplaceAll(post.Title, " ", "-")
			mostRecentPosts[index] = post
		}

		ts, err := template.ParseFiles("pages/index.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}

		data := indexPage{
			Title:           "Escape",
			FeaturedPosts:   featuredPosts,
			MostRecentPosts: mostRecentPosts,
		}

		err = ts.Execute(w, data)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println(err.Error())
			return
		}
	}
}

func postHandler(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		query := `
			SELECT
				post_id_fk,
				title,
				subtitle,
				img,
				img_alt,
				content
			FROM
				content
			WHERE post_id_fk = 
		`
		query += vars["post_id"]

		var content []contentPage
		err := db.Select(&content, query)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println("1" + err.Error())
			return
		}
		if len(content) > 0 {
			ts, err := template.ParseFiles("pages/article.html")
			if err != nil {
				http.Error(w, "Internal Server Error", 500)
				log.Println("2" + err.Error())
				return
			}

			content[0].Paragraphs = strings.Split(content[0].Content, "\n")

			err = ts.Execute(w, content[0])
			if err != nil {
				http.Error(w, "Internal Server Error", 500)
				log.Println("3" + err.Error())
				return
			}
		} else {
			http.Redirect(w, r, "/home", http.StatusNotFound)
		}
	}
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	ts, err := template.ParseFiles("pages/login.html")
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println("2" + err.Error())
		return
	}
	err = ts.Execute(w, nil)
	if err != nil {
		http.Error(w, "Internal Server Error", 500)
		log.Println("3" + err.Error())
		return
	}
}

func adminHandler(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		err := authByCookie(db, w, r)
		if err != nil {
			return
		}
		ts, err := template.ParseFiles("pages/admin.html")
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println("2" + err.Error())
			return
		}
		err = ts.Execute(w, nil)
		if err != nil {
			http.Error(w, "Internal Server Error", 500)
			log.Println("3" + err.Error())
			return
		}
	}

}

func authByCookie(db *sqlx.DB, w http.ResponseWriter, r *http.Request) error {
	cookie, err := r.Cookie(authCookieName)
	if err != nil {
		if err == http.ErrNoCookie {
			http.Error(w, "No authcookie passed", 401)
			log.Println(err)
			return err
		}
		http.Error(w, "Internal Server Error", 500)
		log.Println(err)
		return err
	}

	userIDstr := cookie.Value
	userID, _ := strconv.Atoi(userIDstr)
	if !isCorrectUserId(db, userID) {
		http.Error(w, "No authcookie passed", 401)
		return errors.New("Incorrect user id")
	}
	return nil
}

func isCorrectUserId(db *sqlx.DB, userId int) bool {
	var IDs []int
	query := `select user_id from user where email =?`
	err := db.Select(&IDs, query, userId)
	if err != nil {
		return false
	}

	if len(IDs) == 0 {
		return false
	}

	return true
}

func loginUser(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		defer r.Body.Close()

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "1Error", 500)
			log.Println("1" + err.Error())
			return
		}

		var user User
		err = json.Unmarshal(body, &user)

		if err != nil {
			http.Error(w, "2Error", 500)
			log.Println("2" + err.Error())
			return
		}

		if isRegisteredUser(db, user) {
			http.SetCookie(w, &http.Cookie{
				Name:    authCookieName,
				Value:   fmt.Sprint(user.Id),
				Path:    "/",
				Expires: time.Now().AddDate(0, 0, 1),
			})
			w.WriteHeader(http.StatusOK)
		} else {
			http.Error(w, "Incorrect password or email", 401)
		}
	}
}

func isRegisteredUser(db *sqlx.DB, user User) bool {
	query := `select user_id, email, password from user where email =?`

	var users []User
	err := db.Select(&users, query, user.Email)
	if err != nil {
		return false
	}

	if len(users) == 0 {
		return false
	}
	if users[0].Password != user.Password {
		return false
	}
	return true
}

func logoutUser(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:    authCookieName,
		Path:    "/",
		Expires: time.Now().AddDate(0, 0, -1),
	})
	w.WriteHeader(http.StatusOK)
}

func publishPost(db *sqlx.DB) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		err := authByCookie(db, w, r)
		if err != nil {
			return
		}
		defer r.Body.Close()

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "1Error", 500)
			log.Println("1" + err.Error())
			return
		}

		var post PublishPostRequest
		err = json.Unmarshal(body, &post)

		if err != nil {
			http.Error(w, "2Error", 500)
			log.Println("2" + err.Error())
			return
		}

		imgPathAvatar, err := saveImgFromBase64(post.AuthorPhoto)

		if err != nil {
			http.Error(w, "3Error", 500)
			log.Println("3" + err.Error())
			return
		}

		imgPathPost, err := saveImgFromBase64(post.HeroImg)

		if err != nil {
			http.Error(w, "4Error", 500)
			log.Println("4" + err.Error())
			return
		}

		query := `INSERT INTO post (img, img_alt, title, subtitle, author, author_img, publish_date)
		VALUES (?, ?, ?, ?, ?, ?, ?)`
		_, err = db.Query(query, imgPathPost, "post", post.Title, post.Description, post.AuthorName, imgPathAvatar, "2023-12-23")

		if err != nil {
			http.Error(w, "5Error", 500)
			log.Println("5" + err.Error())
			return
		}
	}
}

func saveImgFromBase64(imgData string) (string, error) {
	b64data := imgData[strings.IndexByte(imgData, ',')+1:]

	img, err := base64.StdEncoding.DecodeString(b64data)
	if err != nil {
		return "", err
	}

	imgPath := "static/img/" + uuid.New().String() + ".jpeg"
	file, err := os.Create(imgPath)

	if err != nil {
		return "", err
	}

	_, err = file.Write(img)

	if err != nil {
		return "", err
	}
	return imgPath, nil
}

func getMimeTypeFromBase64(b64Data string) string {
	return ""
}
