-- SQL script to add description column to pdf_uploads table
-- Run this if TypeORM synchronization doesn't automatically add the column

USE `nepali_congress_db`; -- Replace with your actual database name

-- Add description column to pdf_uploads table
ALTER TABLE `pdf_uploads` 
ADD COLUMN `description` TEXT NULL 
AFTER `eventId`;

-- Verify the column was added
DESCRIBE `pdf_uploads`;


ALTER TABLE events ADD COLUMN latitude DECIMAL(10, 8) NULL;
ALTER TABLE events ADD COLUMN longitude DECIMAL(11, 8) NULL;

ALTER TABLE social_links 
ADD COLUMN description TEXT NULL 

CREATE TABLE event_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  eventId INT NOT NULL,
  fileName VARCHAR(1000) NOT NULL,
  filePath VARCHAR(1000) NOT NULL,
  mimeType VARCHAR(100) NULL,
  fileSize INT NULL,
  createdAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updatedAt DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);
