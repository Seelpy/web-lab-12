CREATE TABLE post (
   `post_id`      INT NOT NULL AUTO_INCREMENT,
   `img`          VARCHAR(255) NOT NULL DEFAULT '',
   `img_alt`      VARCHAR(255) NOT NULL DEFAULT '',
   `category`     VARCHAR(255) NOT NULL DEFAULT '',
   `title`        VARCHAR(255) NOT NULL,
   `subtitle`     VARCHAR(255) NOT NULL,
   `img_modifier` VARCHAR(255) NOT NULL DEFAULT '',
   `author`       VARCHAR(255) NOT NULL,
   `author_img`   VARCHAR(255) NOT NULL,
   `publish_date` TIMESTAMP,
   `featured`     TINYINT(1) DEFAULT 0,
   PRIMARY KEY (`post_id`)
);
