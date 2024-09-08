-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 08, 2024 at 11:48 AM
-- Server version: 10.6.18-MariaDB-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nc_campaign`
--

-- --------------------------------------------------------

--
-- Table structure for table `committees`
--

CREATE TABLE `committees` (
  `committeeId` int(11) NOT NULL,
  `committeeName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `eventName` varchar(255) NOT NULL,
  `eventDate` datetime NOT NULL,
  `eventType` varchar(255) NOT NULL,
  `committeeId` int(11) NOT NULL,
  `subCommitteeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `levels`
--

CREATE TABLE `levels` (
  `levelId` int(11) NOT NULL,
  `levelName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `memberId` int(11) NOT NULL,
  `memberName` varchar(255) NOT NULL,
  `mobileNumber` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `committeeId` int(11) DEFAULT NULL,
  `subCommitteeId` int(11) DEFAULT NULL,
  `levelId` int(11) DEFAULT NULL,
  `positionId` int(11) DEFAULT NULL,
  `representative` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `positionId` int(11) NOT NULL,
  `positionName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `representatives`
--

CREATE TABLE `representatives` (
  `representativesId` int(11) NOT NULL,
  `memberId` varchar(255) NOT NULL,
  `subLevelId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `structures`
--

CREATE TABLE `structures` (
  `structureId` int(11) NOT NULL,
  `committeeId` int(11) NOT NULL,
  `subCommitteeId` int(11) DEFAULT NULL,
  `levelId` int(11) NOT NULL,
  `positionId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sub_committees`
--

CREATE TABLE `sub_committees` (
  `subCommitteeId` int(11) NOT NULL,
  `subCommitteeName` varchar(255) NOT NULL,
  `committeeId` int(11) NOT NULL,
  `membersMemberId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sub_level`
--

CREATE TABLE `sub_level` (
  `subLevelId` int(11) NOT NULL,
  `committeeId` int(11) NOT NULL,
  `subCommitteeId` int(11) DEFAULT NULL,
  `levelId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `committees`
--
ALTER TABLE `committees`
  ADD PRIMARY KEY (`committeeId`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_9c420cfb61c9e7c13936176c9fc` (`committeeId`),
  ADD KEY `FK_ad7a8da28942de86e669462ddee` (`subCommitteeId`);

--
-- Indexes for table `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`levelId`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`memberId`),
  ADD KEY `FK_2df21a5e1e26fb4ae075d7f4e02` (`levelId`),
  ADD KEY `FK_3742c617bc0dc5b4dcdaf58bb93` (`positionId`),
  ADD KEY `FK_ab3f49544a5145ad1184c32cf29` (`subCommitteeId`),
  ADD KEY `FK_92c3822efd1cdb1e2b17e20ea70` (`committeeId`);

--
-- Indexes for table `positions`
--
ALTER TABLE `positions`
  ADD PRIMARY KEY (`positionId`);

--
-- Indexes for table `representatives`
--
ALTER TABLE `representatives`
  ADD PRIMARY KEY (`representativesId`),
  ADD UNIQUE KEY `REL_371f38ac1a9d142912153f852d` (`subLevelId`);

--
-- Indexes for table `structures`
--
ALTER TABLE `structures`
  ADD PRIMARY KEY (`structureId`),
  ADD KEY `FK_78937dbe41fa0d23db8fbad9019` (`committeeId`),
  ADD KEY `FK_2f6e12e886b1246b11f00cce70a` (`subCommitteeId`),
  ADD KEY `FK_be288497df8032b881cdf65d358` (`levelId`),
  ADD KEY `FK_e5ff5636d6e601c97caa8bea1ca` (`positionId`);

--
-- Indexes for table `sub_committees`
--
ALTER TABLE `sub_committees`
  ADD PRIMARY KEY (`subCommitteeId`),
  ADD KEY `FK_42d781f46fd3aefe5f79a309a8d` (`committeeId`),
  ADD KEY `FK_0e63a9a557f5c45c0c35999dc7a` (`membersMemberId`);

--
-- Indexes for table `sub_level`
--
ALTER TABLE `sub_level`
  ADD PRIMARY KEY (`subLevelId`),
  ADD KEY `FK_6116eb1df1b0b0f3687fc361086` (`committeeId`),
  ADD KEY `FK_3ba7a8ef82abaf11d88ac42c4d8` (`subCommitteeId`),
  ADD KEY `FK_98239f9223144c1335dc14cc036` (`levelId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `committees`
--
ALTER TABLE `committees`
  MODIFY `committeeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `levels`
--
ALTER TABLE `levels`
  MODIFY `levelId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `memberId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `positionId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `representatives`
--
ALTER TABLE `representatives`
  MODIFY `representativesId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `structures`
--
ALTER TABLE `structures`
  MODIFY `structureId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_committees`
--
ALTER TABLE `sub_committees`
  MODIFY `subCommitteeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_level`
--
ALTER TABLE `sub_level`
  MODIFY `subLevelId` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `FK_9c420cfb61c9e7c13936176c9fc` FOREIGN KEY (`committeeId`) REFERENCES `committees` (`committeeId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ad7a8da28942de86e669462ddee` FOREIGN KEY (`subCommitteeId`) REFERENCES `sub_committees` (`subCommitteeId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `members`
--
ALTER TABLE `members`
  ADD CONSTRAINT `FK_2df21a5e1e26fb4ae075d7f4e02` FOREIGN KEY (`levelId`) REFERENCES `levels` (`levelId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_3742c617bc0dc5b4dcdaf58bb93` FOREIGN KEY (`positionId`) REFERENCES `positions` (`positionId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_92c3822efd1cdb1e2b17e20ea70` FOREIGN KEY (`committeeId`) REFERENCES `committees` (`committeeId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_ab3f49544a5145ad1184c32cf29` FOREIGN KEY (`subCommitteeId`) REFERENCES `sub_committees` (`subCommitteeId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `representatives`
--
ALTER TABLE `representatives`
  ADD CONSTRAINT `FK_371f38ac1a9d142912153f852d3` FOREIGN KEY (`subLevelId`) REFERENCES `sub_level` (`subLevelId`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `structures`
--
ALTER TABLE `structures`
  ADD CONSTRAINT `FK_2f6e12e886b1246b11f00cce70a` FOREIGN KEY (`subCommitteeId`) REFERENCES `sub_committees` (`subCommitteeId`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_78937dbe41fa0d23db8fbad9019` FOREIGN KEY (`committeeId`) REFERENCES `committees` (`committeeId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_be288497df8032b881cdf65d358` FOREIGN KEY (`levelId`) REFERENCES `levels` (`levelId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_e5ff5636d6e601c97caa8bea1ca` FOREIGN KEY (`positionId`) REFERENCES `positions` (`positionId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `sub_committees`
--
ALTER TABLE `sub_committees`
  ADD CONSTRAINT `FK_0e63a9a557f5c45c0c35999dc7a` FOREIGN KEY (`membersMemberId`) REFERENCES `members` (`memberId`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_42d781f46fd3aefe5f79a309a8d` FOREIGN KEY (`committeeId`) REFERENCES `committees` (`committeeId`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `sub_level`
--
ALTER TABLE `sub_level`
  ADD CONSTRAINT `FK_3ba7a8ef82abaf11d88ac42c4d8` FOREIGN KEY (`subCommitteeId`) REFERENCES `sub_committees` (`subCommitteeId`) ON DELETE SET NULL ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_6116eb1df1b0b0f3687fc361086` FOREIGN KEY (`committeeId`) REFERENCES `committees` (`committeeId`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_98239f9223144c1335dc14cc036` FOREIGN KEY (`levelId`) REFERENCES `levels` (`levelId`) ON DELETE CASCADE ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;