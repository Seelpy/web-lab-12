package main

type featuredPostData struct {
	PostId      string `db:"post_id"`
	Category    string `db:"category"`
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	ImgModifier string `db:"img_modifier"`
	Author      string `db:"author"`
	AuthorImg   string `db:"author_img"`
	PublishDate string `db:"publish_date"`
	URLTitle    string
}

type mostRecentPostData struct {
	PostId      string `db:"post_id"`
	Img         string `db:"img"`
	ImgAlt      string `db:"img_alt"`
	Title       string `db:"title"`
	Subtitle    string `db:"subtitle"`
	Author      string `db:"author"`
	AuthorImg   string `db:"author_img"`
	PublishDate string `db:"publish_date"`
	URLTitle    string
}

type indexPage struct {
	Title           string
	FeaturedPosts   []featuredPostData
	MostRecentPosts []mostRecentPostData
}

type contentPage struct {
	PostId     string `db:"post_id_fk"`
	Title      string `db:"title"`
	Subtitle   string `db:"subtitle"`
	Img        string `db:"img"`
	ImgAlt     string `db:"img_alt"`
	Content    string `db:"content"`
	Paragraphs []string
}

type PublishPostRequest struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	AuthorName  string `json:"authorName"`
	AuthorPhoto string `json:"authorPhoto"`
	Date        string `json:"date"`
	HeroImg     string `json:"heroImg"`
	Content     string `json:"content"`
}

type User struct {
	Id       int    `db:"user_id"`
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}
