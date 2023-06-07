CREATE TABLE content (
  `content_id`    INT AUTO_INCREMENT PRIMARY KEY,
  `post_id_fk`    INT,
  `title`         VARCHAR(255) NOT NULL,
  `subtitle`      VARCHAR(255) NOT NULL,
  `img`           VARCHAR(255) NOT NULL,
  `img_alt`       VARCHAR(255) NOT NULL,
  `content`       TEXT NOT NULL,
  FOREIGN KEY (post_id_fk) REFERENCES post(post_id)
);
