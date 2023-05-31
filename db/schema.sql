DROP DATABASE IF EXISTS music_boxd_db;
CREATE DATABASE music_boxd_db;

USE music_boxd_db;

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` INTEGER NOT NULL auto_increment ,
   `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE, 
    `password` VARCHAR(255) NOT NULL, 
    PRIMARY KEY (`user_id`));

CREATE TABLE IF NOT EXISTS `review` (
  `review_id` INTEGER NOT NULL auto_increment ,
  `album_id` VARCHAR(255) NOT NULL,
  `user_id` INTEGER NOT NULL,
  `review` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`review_id`)
);