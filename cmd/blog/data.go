package main

import "github.com/jmoiron/sqlx"

func getFeaturedPosts(db *sqlx.DB) ([]featuredPostData, error) {
	const query = `
		SELECT
			post_id,
			category,
			title,
			subtitle,
			img_modifier,
			author,
			author_img,
			publish_date
		FROM
			post
		WHERE featured = 1
	`
	var posts []featuredPostData
	err := db.Select(&posts, query)
	if err != nil {
		return nil, err
	}
	return posts, nil
}

func getMostRecentPosts(db *sqlx.DB) ([]mostRecentPostData, error) {
	const query = `
		SELECT
			post_id,
			img,
			img_alt,
			title,
			subtitle,
			author,
			author_img,
			publish_date
		FROM
			post
		WHERE featured = 0
	`
	var posts []mostRecentPostData
	err := db.Select(&posts, query)
	if err != nil {
		return nil, err
	}
	return posts, nil
}
