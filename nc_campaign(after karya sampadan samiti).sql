-- phpMyAdmin SQL Dump
-- version 5.2.1deb3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 30, 2024 at 12:07 PM
-- Server version: 10.11.8-MariaDB-0ubuntu0.24.04.1
-- PHP Version: 8.3.6

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

--
-- Dumping data for table `committees`
--

INSERT INTO `committees` (`committeeId`, `committeeName`) VALUES
(1, 'केन्द्रीय समिति'),
(2, 'केन्द्रीय कार्य सम्पादन समिति');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `eventId` int(11) NOT NULL,
  `eventHeading` varchar(255) NOT NULL,
  `eventDetails` varchar(255) NOT NULL,
  `eventDate` varchar(255) NOT NULL,
  `eventTime` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT 'अन्य',
  `province` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `municipality` varchar(255) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `eventOrganizer` varchar(255) NOT NULL,
  `remarks` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `levels`
--

CREATE TABLE `levels` (
  `levelId` int(11) NOT NULL,
  `levelName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `levels`
--

INSERT INTO `levels` (`levelId`, `levelName`) VALUES
(1, 'केन्द्र'),
(2, 'प्रदेश'),
(3, 'जिल्ला'),
(4, 'पालिका');

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
  `address` varchar(255) DEFAULT 'अन्य',
  `province` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `municipality` varchar(255) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`memberId`, `memberName`, `mobileNumber`, `email`, `committeeId`, `subCommitteeId`, `levelId`, `positionId`, `representative`, `address`, `province`, `district`, `municipality`, `ward`, `remarks`) VALUES
(1, 'श्री शेरबहादुर देउवा', '9851087288', 'piyushrl26@gmail.com', 1, NULL, 1, 1, '', 'नेपाल', 'सुदुरपश्चिम ', 'डडेल्धुरा', '', '', ''),
(2, 'श्री पूर्णबहादुर खड्का', '9851085749', 'purnakhadka649@gmail.com', 1, NULL, 1, 2, '', 'नेपाल', 'कर्णाली', 'सुर्खेत', '', '', ''),
(3, 'श्री धनराज गुरूङ', '9851069204', 'dhanraj.grg2022@gmail.com', 1, NULL, 1, 2, '', 'नेपाल', 'गण्डकी', 'स्याङ्जा', '', '', ''),
(4, 'श्री गगनकुमार थापा', '9851067214\n', 'thapagk@gmail.com', 1, NULL, 1, 3, '', 'नेपाल', 'वागमती', 'काठमाडौं', '', '', ''),
(5, 'श्री विश्वप्रकाश शर्मा', '9841329990', 'bishwap77@gmail.com', 1, NULL, 1, 3, '', 'नेपाल', 'कोशी', 'झापा', '', '', ''),
(6, 'श्री फरमुल्लाह मंसुर', '9851010155', 'mansoorfarmullah155@gmail.com', 1, NULL, 1, 4, '', 'नेपाल', 'मधेश', 'बारा', '', '', ''),
(7, 'श्री उमाकान्त चौधरी', '9851111667', 'chaudharyumakant2021@gmail.com', 1, NULL, 1, 4, '', 'नेपाल', 'मधेश', 'बारा', '', '', ''),
(8, 'श्री  महालक्ष्मी उपाध्याय ‘डिना’', '9851064899', 'dina99.nc@gmail.com', 1, NULL, 1, 4, '', 'नेपाल', 'वागमती', 'मकवानपुर', '', '', ''),
(9, 'श्री भीष्मराज आङ्दम्वे', '9841468545', 'vishmalimbu@gmail.com', 1, NULL, 1, 4, '', 'नेपाल', 'कोशी', 'पाँचथर', '', '', ''),
(10, 'श्री महेन्द्र यादव', '9851108446', 'mahendradd@hotmail.com', 1, NULL, 1, 4, '', 'नेपाल', 'मधेश', 'धनुषा', '', '', ''),
(11, 'श्री किशोरसिंह राठौर', '9851027666', '', 1, NULL, 1, 4, '', 'नेपाल', 'लुम्बिनी', 'वर्दिया', '', '', ''),
(12, 'श्री बद्रीप्रसाद पाण्डे', '9851098488', 'pandeybadri1@gmail.com', 1, NULL, 1, 4, '', 'नेपाल', 'कर्णाली', 'बाजुरा', '', '', ''),
(13, 'श्री जीवन परियार', '9851063729', 'pariyarjeevanadv@gmail.com', 1, NULL, 1, 4, '', 'नेपाल', 'गण्डकी', 'कास्की', '', '', ''),
(14, 'श्री गोपालमान श्रेष्ठ', '9851042333', 'gopalman.sth@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'स्याङ्जा', '', '', ''),
(15, 'श्री प्रकाशमान सिंह', '9851023764', 'pmcbari@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'काठमाडौं', '', '', ''),
(16, 'श्री विमलेन्द्र निधि', '9851016554', 'nidhi_bimal@hotmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'धनुषा', '', '', ''),
(17, 'श्री विजयकुमार गच्छदार', '9851033450', 'cgyagya9@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सुनसरी', '', '', ''),
(18, 'श्री कृष्णप्रसाद सिटौला', '9851109796', 'sitaulakrishnaprasad@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'झापा', '', '', ''),
(19, 'डा. शशांक कोइराला', '9851089833', 'koirala.shashank@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'नवलपुर', '', '', ''),
(20, 'श्री चित्रलेखा यादव', '9851198985', 'yadavchitralekha@yahoo.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'सिरहा', '', '', ''),
(21, 'डा. रामशरण महत', '9801042466', 'ramsmahat@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'नुवाकोट', '', '', ''),
(22, 'श्री अर्जुननरसिंह के.सी. ', '9851032405', 'arjunnkc@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'नुवाकोट', '', '', ''),
(23, 'डा. प्रकाशशरण महत', '9851035759', 'psmahat@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'नुवाकोट', '', '', ''),
(24, 'श्री सुनिलबहादुर थापा', '9851048666', 'sunelthapa@gmail.com\nsbt@info.com.np', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'धनकुटा', '', '', ''),
(25, 'डा. शेखर कोइराला', '9851055411', 'koiralashekhar@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'मोरङ', '', '', ''),
(26, 'श्री बलबहादुर के.सी.', '9851014499', 'balbahadurkc76@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सोलुखुम्बु', '', '', ''),
(27, 'श्री बालकृष्ण खाँण', '9851023599', 'khandbk@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'रुपन्देही', '', '', ''),
(28, 'श्री ज्ञानेन्द्रबहादुर कार्की', '9851014940', 'gyanendrabahadurkarki@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सुनसरी', '', '', ''),
(29, 'श्री रमेश रिजाल', '9851031355', 'mashihani7@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'पर्सा', '', '', ''),
(30, 'डा. नारायण खड्का', '9851076710', 'nkhadka_ktm@hotmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'उदयपुर', '', '', ''),
(31, 'डा. मिनेन्द्र रिजाल', '9851032339', 'mrijal@hotmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'मोरङ', '', '', ''),
(32, 'श्री उमा रेग्मी', '9851086892', 'taraad973@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'चितवन', '', '', ''),
(33, 'श्री जीपछिरिङ लामा', '9851023944', 'jiptlamaa@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'दोलखा', '', '', ''),
(34, 'श्री मानबहादुर विश्वकर्मा', '9851211011\n', 'vishwakarma.mb@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'अर्घाखाँची', '', '', ''),
(35, 'श्री सुजाता कोइराला', '9843279980', 'koiralasujata@yahoo.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सुनसरी', '', '', ''),
(36, 'श्री पद्मनारायण चौधरी', '9852833444', 'pnchy1947@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'सिरहा', '', '', ''),
(37, 'श्री दिलेन्द्रप्रसाद बडू', '9851011666', 'dilendraprasadbadu@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'दार्चुला', '', '', ''),
(38, 'श्री एन.पी. साउद', '9851187912', 'npsauda@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'कञ्चनपुर', '', '', ''),
(39, 'श्री अर्जुनप्रसाद जोशी', '9851026680', 'arjunpdjoshi@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'पर्वत', '', '', ''),
(40, 'श्री जीवनबहादुर शाही', '9851042576', 'jiwanshahi@yahoo.com', 1, NULL, 1, 5, '', 'नेपाल', 'कर्णाली', 'हुम्ला', '', '', ''),
(41, 'श्री आनन्दप्रसाद ढुंगाना', ' \n9851166605', 'ncapdhungana@yahoo.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'धनुषा', '', '', ''),
(42, 'श्री कृष्णचन्द्र नेपाली पोखरेल', '9843360524', 'kcnepali@hotmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'नवलपुर', '', '', ''),
(43, 'श्री दिपक गिरी', '9851146780\n', 'deltanepal@hotmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'दाङ', '', '', ''),
(44, 'डा. चन्द्रकान्त भण्डारी', '9851159333\n', 'chandragulmi4@yahoo.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'गुल्मी', '', '', ''),
(45, 'श्री अजयकुमार चौरसिया', '9851015924\n', 'ajaychaurasianp@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'पर्सा', '', '', ''),
(46, 'सुश्री अम्बिका बस्नेत', '9851012744', 'ambikabasnet661@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'काठमाडौं', '', '', ''),
(47, 'श्री पुष्पा भुसाल', '9841255545', 'pushpa605@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'अर्घाखाँची', '', '', ''),
(48, 'श्री सुरेन्द्रराज पाण्डे', '9851024834', 'spandeync@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'गोरखा', '', '', ''),
(49, 'श्री शंकर भण्डारी', '9851077439\n', 'tarunbibhag@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'तनहुँ', '', '', ''),
(50, 'श्री मीनबहादुर विश्वकर्मा', '9851060690', 'meendharan@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सुनसरी', '', '', ''),
(51, 'श्री ईश्वरी न्यौपाने', '9851242101', 'ishwori2072@yahoo.com\nishwori072@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'कैलाली', '', '', ''),
(52, 'श्री सीता गुरुङ', '9851046756', 'sitagurung1@yahoo.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'तेह्रथुम', '', '', ''),
(53, 'श्री मिनाक्षी झा', '9851175096', '', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'धनुषा', '', '', ''),
(54, 'श्री सुजाता परियार', '9851017953', 'sujatapariyar40@yahoo.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'इलाम', '', '', ''),
(55, 'श्री गोविन्द भट्टराई', '9851195999', 'bhattaraigo@yahoo.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'तनहुँ', '', '', ''),
(56, 'श्री श्यामकुमार घिमिरे', '9851074435', 'samajdental@gmail.com\nshyamkumarghimire@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'सिन्धुली', '', '', ''),
(57, 'श्री प्रदीप पौडेल', '9851004286', 'ppaudelnc@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'तनहुँ', '', '', ''),
(58, 'श्री कल्याणकुमार गुरुङ', '9851087352', 'kalyangurung@hotmail.com\nkalyangurung@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'महोत्तरी', '', '', ''),
(59, 'श्री चिनकाजी श्रेष्ठ', '9851134567', 'chinkaji123@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'गोरखा', '', '', ''),
(60, 'श्री मोहनबहादुर बस्नेत', '9851025917', '', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'सिन्धुपाल्चोक', '', '', ''),
(61, 'श्री देवेन्द्रराज कण्डेल', '9851023526', 'devendrarajkandel@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'नवलपरासी', '', '', ''),
(62, 'डा. डिला संग्रौला', '9841459567', 'dilasangroula@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'मोरङ', '', '', ''),
(63, 'श्री रमेश लेखक', '9851180333', 'rlekhak54@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'कञ्चनपुर', '', '', ''),
(64, 'श्री किरण यादव', '', 'yadavkiran0330@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'महोत्तरी', '', '', ''),
(65, 'सुश्री सरिता प्रसाई', '9841536688', 'prasaisarita2@gmail.com\nprasai_sarita@hotmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'झापा', '', '', ''),
(66, 'श्री बहादुर सिंह (लामा) तामाङ', '9851110759', '', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'नुवाकोट', '', '', ''),
(67, 'श्री लक्ष्मी परियार', '9851112619', 'pariyarlaxmi170@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'उदयपुर', '', '', ''),
(68, 'श्री ध्यानगोविन्द रञ्जित', '\n9851023980', '', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'काठमाडौं', '', '', ''),
(69, 'श्री अमृत अर्याल', '9852024333\n', '', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'मोरङ', '', '', ''),
(70, 'श्री शिवप्रसाद हुमागाँइ', '9841552305', '', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'काभ्रेपलाञ्चोक', '', '', ''),
(71, 'श्री शिला शर्मा खड्का', '9808519500', '', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'दाङ', '', '', ''),
(72, 'श्री कर्णबहादुर बुढा ', '9851084077', '', 1, NULL, 1, 5, '', 'नेपाल', 'कर्णाली', 'डोल्पा', '', '', ''),
(73, 'श्री रामजनम चौधरी ', '9851006546', '', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'कैलाली', '', '', ''),
(74, 'डा. गोपाल दहित ', '9851119139', 'gdahit.un@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'वर्दिया', '', '', ''),
(75, 'श्री योगेन्द्र चौधरी ', '9857831218', 'yogencm31@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'दाङ', '', '', ''),
(76, 'श्री कल्पना चौधरी ', '9842035199', '', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सुनसरी', '', '', ''),
(77, 'श्री यज्ञराज जोशी ', '9848725786', 'harijoshi295@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'कञ्चनपुर', '', '', ''),
(78, 'श्री किरणराज शर्मा पौडेल', '9851024333', 'baglunga@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'बाग्लुङ', '', '', ''),
(79, 'श्री रमा कोइराला (पौडेल)', '9841375499', 'ramapoudyal2019@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'भक्तपुर', '', '', ''),
(80, 'श्री कृष्णकिशोर घिमिरे', '9841554574', '', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'दाङ', '', '', ''),
(81, 'श्री धु्रव वाग्ले', '9856060488', 'dhruba2018@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'तनहुँ', '', '', ''),
(82, 'श्री टेकप्रसाद गुरुङ', '9855056965', '', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'चितवन', '', '', ''),
(83, 'श्री महेन्द्रकुमार राय', '9844031907', 'roymahendra55@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'महोत्तरी', '', '', ''),
(84, 'श्री गेहेन्द्र गिरी', '9857820251', 'gehendragiri834@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'दाङ', '', '', ''),
(85, 'श्री नारायणबहादुर कार्की', '9851246946', '', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'उदयपुर', '', '', ''),
(86, 'श्री सञ्जयकुमार गौतम', '9858021123', 'sanjaya.bardiya@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'वर्दिया', '', '', ''),
(87, 'श्री तारामान गुरुङ', '9851043443', 'tmgmakalu@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'संखुवासभा', '', '', ''),
(88, 'श्री आङ्गेलु शेर्पा', '9851010160', 'anggelusherpa@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सोलुखुम्बु', '', '', ''),
(89, 'श्री मधु आचार्य', '9851112067', 'madhuryacpta@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'काभ्रेपलाञ्चोक', '', '', ''),
(90, 'श्री दिनेशकुमार यादव', '9842822158', '', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'सप्तरी', '', '', ''),
(91, 'श्री मदनबहादुर अमात्य', '9851115219', 'madanamatya@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'ललितपुर', '', '', ''),
(92, 'श्री राजीव कोइराला', '9842048136', 'rajiwkoirala@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सुनसरी', '', '', ''),
(93, 'श्री अब्दुल रज्जाक', '9847020786', '', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'रुपन्देही', '', '', ''),
(94, 'श्री टेकबहादुर गुरुङ', '9802006789', '', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'मनाङ', '', '', ''),
(95, 'श्री प्रदीपकुमार सुनुवार', '9851197900', '', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'ओखलढुंगा', '', '', ''),
(96, 'श्री चन्द्रबहादुर के.सी.', '9841436488', 'kalpanakc205@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'गुल्मी', '', '', ''),
(97, 'श्री मानबहादुर नेपाली ', '9851175395', '', 1, NULL, 1, 5, '', 'नेपाल', 'कर्णाली', 'रुकुम(पश्चिम)', '', '', ''),
(98, 'डा. आरजु राणा देउवा', '9862566840', 'piyushrl26@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'डडेल्धुरा', '', '', ''),
(99, 'श्री उमेशजंग रायमाझी', '9851016258', 'umeshjung58@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'भोजपुर', '', '', ''),
(100, 'श्री अब्दुल सत्तार', '9851285786', 'abdulsattar631@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'गोरखा', '', '', ''),
(101, 'श्री उदयशम्शेर राणा', '9851061424', 'udayasjbrana70@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'ललितपुर', '', '', ''),
(102, 'श्री जीतजंग बस्नेत', '9851087937', 'jitjungbasnet@yahoo.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'ललितपुर', '', '', ''),
(103, 'श्री नैनसिंह महर', '9841285624', 'nainsingnsu@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'डडेल्धुरा', '', '', ''),
(104, 'श्री राजीव ढुंगाना', '9841256932', '', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सुनसरी', '', '', ''),
(105, 'श्री गोविन्दबहादुर शाह', '9851087499', 'shahgovind7@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'अछाम', '', '', ''),
(106, 'श्री राजेन्द्रकुमार के.सी.', '9851085709', '', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'काठमाडौं', '', '', ''),
(107, 'डा. रणबहादुर रावल', '9851092461', 'rbrawal123@hotmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'कैलाली', '', '', ''),
(108, 'श्री अर्जुनजंगबहादुर सिंह', '9841188211', '', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'बझाङ', '', '', ''),
(109, 'श्री दिलमान पाख्रिन ', '9851147005', 'dilpakhrin8@hotmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'धादिङ', '', '', ''),
(110, 'श्री महेन्द्र कुमारी लिम्बू', '9852683324', '', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'झापा', '', '', ''),
(111, 'श्री रामहरि खतिवडा', '9851021798', 'ramhari2027@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'ओखलढुंगा', '', '', ''),
(112, 'श्री उमेश श्रेष्ठ', '9851020026', '', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'चितवन', '', '', ''),
(113, 'श्री राजीवबिक्रम शाह', '9851023335', 'rjv.shh@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कर्णाली', 'जाजरकोट', '', '', ''),
(114, 'श्री विनोदकुमार चौधरी', '9802021000', 'bkc.secretariat@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'नवलपुर', '', '', ''),
(115, 'डा. चन्द्रमोहन यादव', '\n9851171334', 'cmyadav07@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'धनुषा', '', '', ''),
(116, 'श्री अञ्जनी श्रेष्ठ', '9855053948', 'anjanishr2076@gmail.com\nanjanisth300@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'चितवन', '', '', ''),
(117, 'श्री मैकुलाल वाल्मिकी', '\n9858029499', '', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'बाँके', '', '', ''),
(118, 'श्री सरस्वती बजिमय', '9851186172', 'sarbajimayo@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'खोटाङ', '', '', ''),
(119, 'श्री चम्पादेवी खड्का', '9857620010\n', 'champakhadka10@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'बाग्लुङ', '', '', ''),
(120, 'श्री प्रकाश रसाइली स्नेही ', '9851019618', 'prakashrsnehi18@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'बझाङ', '', '', ''),
(121, 'ई. मोहन आचार्य', '9802073755', 'paudyal.sunil1@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'रसुवा', '', '', ''),
(122, 'श्री मुक्ताकुमारी यादव', '9851167117', 'muktayadav601@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'धनुषा', '', '', ''),
(123, 'श्री रंगमती शाही', '9851119068', 'rangamati06@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कर्णाली', 'हुम्ला', '', '', ''),
(124, 'श्री मञ्जुकुमारी यादव', '9844030604', 'yadavmanju39075@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'महोत्तरी', '', '', ''),
(125, 'श्री सरस्वती अर्याल तिवारी', '9841368924', 'sarasowti123@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'स्याङ्जा', '', '', ''),
(126, 'श्री मञ्जु खाँण', '9841297159', 'santu2341@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'सिरहा', '', '', ''),
(127, 'श्री गुरु वराल', '9851017950', 'gurubaral22@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'कास्की', '', '', ''),
(128, 'श्री प्रतिमा गौतम', '9841236756', 'pratimagautam305@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'काठमाडौं', '', '', ''),
(129, 'श्री कुन्दनराज काफ्ले ', '9851079738', 'kundanrajkafle@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'दोलखा', '', '', ''),
(130, 'श्री जावेदा खातुन जागा', '9848130167', 'jabedakhatunjaga1@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'वर्दिया', '', '', ''),
(131, 'श्री हरिशरण नेपाली', '9851045254', 'nharisharan@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'काठमाडौं', '', '', ''),
(132, 'श्री जानकी सिंह', '9843698990', '', 1, NULL, 1, 5, '', 'नेपाल', 'कर्णाली', 'सुर्खेत', '', '', ''),
(133, 'प्रा. डा. गोविन्दराज पोखरेल', '9851100407', 'pokharelgr@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'प्यूठान', '', '', ''),
(134, 'श्री सुशिला मिश्र भट्ट', '9841883788', 'sushilamishrabhatta@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'कैलाली', '', '', ''),
(135, 'श्री नागिना यादव', '9841775607', 'isnagina@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'महोत्तरी', '', '', ''),
(136, 'श्री नानु बास्तोला', '9851098820', 'bastolananu@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'काठमाडौं', '', '', ''),
(137, 'श्री अजयवावु शिवाकोटी', '9851093693', 'ajayashiwakoti@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'दोलखा', '', '', ''),
(138, 'श्री मदनकृष्ण श्रेष्ठ', '9851001818', 'sht_madan@yahoo.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'भक्तपुर', '', '', ''),
(139, 'श्री भीम पराजुली', '9852022646', 'parajulibhim1@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'मोरङ', '', '', ''),
(140, 'श्री नृपबहादुर वड', '9858423074', '', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'कैलाली', '', '', ''),
(141, 'श्री कान्तिका सेजुवाल', '9848305222', 'kantikasejuwal2@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कर्णाली', 'जुम्ला', '', '', ''),
(142, 'श्री गंगालक्ष्मी अवाल', '9841241747', 'gangawal@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'भक्तपुर', '', '', ''),
(143, 'श्री दिनेश कोइराला', '9851073890', 'dinkoirala19@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'चितवन', '', '', ''),
(144, 'श्री उर्मिला नेपाल के.सी.', '9851043475', 'balkc011@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'ललितपुर', '', '', ''),
(145, 'श्री सुशीला थिङ', '9854041999', 'sushilasindhuli180@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'सिन्धुली', '', '', ''),
(146, 'श्री माया राई', '9842261645', 'raimaya645@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'भोजपुर', '', '', ''),
(147, 'श्री सीताकुमारी राना', '9858050705', 'sita.rana@sosec.org.np\nsitakumarirana022@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कर्णाली', 'दैलेख', '', '', ''),
(148, 'श्री सुशीला ढकाल (आचार्य)', '9852671425', 'rd102k17@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'झापा', '', '', ''),
(149, 'श्री गणेश लामा', '9851026686', '', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'काभ्रेपलाञ्चोक', '', '', ''),
(150, 'श्री रूपा वि.क.', '9851056959', 'rupabk303@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'कपिलवस्तु', '', '', ''),
(151, 'श्री विद्यादेवी तिमिल्सीना', '9841710365', '', 1, NULL, 1, 5, '', 'नेपाल', 'कर्णाली', 'बाजुरा', '', '', ''),
(152, 'श्री शान्ति परियार वि.क.', '9855053880', 'pariyarnc@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'चितवन', '', '', ''),
(153, 'श्री जीवन राना', '9848421347', 'jeevan.ranatharu@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम ', 'कैलाली', '', '', ''),
(154, 'श्री भरतकुमार शाह', '\n9857022484', 'bharatkumarshah2041@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'रुपन्देही', '', '', ''),
(155, 'श्री राधा घले', '9851001565', 'radha.ghale7@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'काठमाडौं', '', '', ''),
(156, 'श्री रुक्मिणी कोइराला', '9852022556', 'rukukoirala@hotmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'मोरङ', '', '', ''),
(157, 'श्री धना खतिवडा', '9851141638', 'dhanakhatiwada@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'ललितपुर', '', '', ''),
(158, 'श्री सीता थपलिया (उर्मिला)', '9851024816', 'urmilathapaliya@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'धादिङ', '', '', ''),
(159, 'श्री कल्याणी रिजाल', '9841511782', '', 1, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'काठमाडौं', '', '', ''),
(160, 'श्री गोमाकुमारी भट्टराई', '9842637600', 'gomabhattarai368@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'झापा', '', '', ''),
(161, 'श्री लक्ष्मी खतिवडा', '9851101104', 'laxmipanbari@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सुनसरी', '', '', ''),
(162, 'श्री गंगा शाही', '9857022496', 'shahiganga300@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'रुपन्देही', '', '', ''),
(163, 'श्री सितादेवी देवकोटा', '9851043604', 'sitadevkotapandey@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'नवलपुर', '', '', ''),
(164, 'श्री शारदा पौडेल', '9846066105', 'shardapoudel01@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'कास्की', '', '', ''),
(165, 'श्री अनिलकुमार रुंगटा', '9855021335', 'jeplanil@gmail.com', 1, NULL, 1, 5, '', 'नेपाल', 'मधेश', 'पर्सा', '', '', ''),
(166, 'श्री नारायणी रायमाझी', '9845036393', 'niruraymajhi26@gmail.com', 1, NULL, 1, 6, '', 'नेपाल', 'मधेश', 'बारा', '', '', ''),
(167, 'श्री दिपक खड्का', '9851053919', '', 1, NULL, 1, 6, '', 'नेपाल', 'कोशी', 'संखुवासभा', '', '', ''),
(168, 'श्री उद्धव थापा', '9852672745', 'uddhavthapa8@gmail.com', 1, NULL, 1, 6, 'कोशी प्रदेश ', 'नेपाल', 'कोशी', 'झापा', '', '', ''),
(169, 'श्री कृष्णप्रसाद यादव', '9851086835', 'krishnayadavky2050@gmail.com', 1, NULL, 1, 6, 'मधेश प्रदेश', 'नेपाल', 'मधेश', 'रौतहट', '', '', ''),
(170, 'श्री ईन्द्रबहादुर बानियाँ', '9855068181', 'indrabaniya753@gmail.com', 1, NULL, 1, 6, 'बागमती प्रदेश', 'नेपाल', 'वागमती', 'मकवानपुर', '', '', ''),
(171, 'श्री शुक्रराज शर्मा', '9851100476', '', 1, NULL, 1, 6, 'गण्डकी प्रदेश', 'नेपाल', 'गण्डकी', 'कास्की', '', '', ''),
(172, 'श्री अमरसिंह पुन', '9851013444', 'amarpun627@gmail.com', 1, NULL, 1, 6, 'लुम्बिनी प्रदेश', 'नेपाल', 'लुम्बिनी', 'रोल्पा', '', '', ''),
(173, 'श्री ललितजंग शाही', '9851085184', 'lalitjungshahi803@gmail.com', 1, NULL, 1, 6, 'कर्णाली प्रदेश', 'नेपाल', 'कर्णाली', 'जुम्ला', '', '', ''),
(174, 'श्री बीरबहादुर बलायर', '9851083566', 'bbbalayar@gmail.com', 1, NULL, 1, 6, 'सुदूरपश्चिम प्रदेश', 'नेपाल', 'सुदुरपश्चिम ', 'डोटी', '', '', ''),
(175, 'श्री शेरबहादुर देउवा', '9851087288', 'piyushrl26@gmail.com', 2, NULL, 1, 1, '', 'नेपाल', 'सुदुरपश्चिम', 'डडेल्धुरा', '', '', ''),
(176, 'श्री पूर्णबहादुर खड्का', '9851085749', 'purnakhadka.skt@gmail.com', 2, NULL, 1, 2, '', 'नेपाल', 'कर्णाली', 'सुर्खेत', '', '', ''),
(177, 'श्री धनराज गुरूङ', '9851069204', 'dhanraj.grg2022@gmail.com', 2, NULL, 1, 2, '', 'नेपाल', 'गण्डकी', 'स्याङ्जा', '', '', ''),
(178, 'श्री गगनकुमार थापा', '9851067214\n', 'thapagk@gmail.com', 2, NULL, 1, 3, '', 'नेपाल', 'वागमती', 'काठमाडौं', '', '', ''),
(179, 'श्री विश्वप्रकाश शर्मा', '9841329990', 'bishwap77@gmail.com', 2, NULL, 1, 3, '', 'नेपाल', 'कोशी', 'झापा', '', '', ''),
(180, 'श्री फरमुल्लाह मंसुर', '9851010155', '', 2, NULL, 1, 4, '', 'नेपाल', 'मदेश', 'बारा', '', '', ''),
(181, 'श्री उमाकान्त चौधरी', '9851111667', 'umakantchaudhary2020@gmail.com', 2, NULL, 1, 4, '', 'नेपाल', 'मदेश', 'बारा', '', '', ''),
(182, 'श्री  महालक्ष्मी उपाध्याय ‘डिना’', '9851064899', 'udinaa@hotmail.com', 2, NULL, 1, 4, '', 'नेपाल', 'वागमती', 'मकवानपुर', '', '', ''),
(183, 'श्री भीष्मराज आङ्दम्वे', '9841468545', 'vishmalimbu@gmail.com', 2, NULL, 1, 4, '', 'नेपाल', 'कोशी', 'पाँचथर', '', '', ''),
(184, 'श्री महेन्द्र यादव', '9851108446', 'mahendradd@hotmail.com', 2, NULL, 1, 4, '', 'नेपाल', 'मदेश', 'धनुषा', '', '', ''),
(185, 'श्री किशोरसिंह राठौर', '9851027666', '', 2, NULL, 1, 4, '', 'नेपाल', 'गण्डकी', 'वर्दिया', '', '', ''),
(186, 'श्री बद्री पाण्डे', '9851098488', 'pandeybadri1@gmail.com', 2, NULL, 1, 4, '', 'नेपाल', 'कर्णाली', 'बाजुरा', '', '', ''),
(187, 'श्री जीवन परियार', '9851063729', 'pariyarjeevanadv@gmail.com', 2, NULL, 1, 4, '', 'नेपाल', 'गण्डकी', 'कास्की', '', '', ''),
(188, 'श्री गोपालमान श्रेष्ठ', '9851042333', 'gopalman.sth@gmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'स्याङ्जा', '', '', ''),
(189, 'श्री प्रकाशमान सिंह', '9851023764', 'pmcbari@gmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'काठमाडौं', '', '', ''),
(190, 'श्री विमलेन्द्र निधि', '9851016554', 'nidhi_bimal@hotmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'मदेश', 'धनुषा', '', '', ''),
(191, 'श्री विजयकुमार गच्छदार', '9851033450', '', 2, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सुनसरी', '', '', ''),
(192, 'श्री कृष्णप्रसाद सिटौला', '9851109796', 'sitaulakrishnaprasad@gmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'झापा', '', '', ''),
(193, 'डा. शशांक कोइराला', '9851089833', 'koirala.shashank@gmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'गण्डकी', 'नवलपुर', '', '', ''),
(194, 'श्री. चित्रलेखा यादव', '9851198985', 'yadavchitralekha@yahoo.com', 2, NULL, 1, 5, '', 'नेपाल', 'मदेश', 'सिरहा', '', '', ''),
(195, 'डा. रामशरण महत', '9801042466', 'ramsmahat@gmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'नुवाकोट', '', '', ''),
(196, 'श्री अर्जुननरसिंह के.सी. ', '9851032405', 'arjunnkc@gmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'नुवाकोट', '', '', ''),
(197, 'डा. प्रकाशशरण महत', '9851035759', 'psmahat@gmail.com', 2, NULL, 1, 7, '', 'नेपाल', 'मदेश', 'नुवाकोट', '', '', ''),
(198, 'श्री सुनिलबहादुर थापा', '9851048666', '', 2, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'धनकुटा', '', '', ''),
(199, 'डा. शेखर कोइराला', '9851055411', 'koiralashekhar@gmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'मोरङ', '', '', ''),
(200, 'श्री बलबहादुर के.सी.', '9851014499', '', 2, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सोलुखुम्बु', '', '', ''),
(201, 'श्री बालकृष्ण खाँण', '9851023599', 'khandbk@gmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'लुम्बिनी', 'रुपन्देही', '', '', ''),
(202, 'श्री ज्ञानेन्द्रबहादुर कार्की', '9851014940', 'gyanendrabahadurkarki@gmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सुनसरी', '', '', ''),
(203, 'श्री रमेश रिजाल', '9851031355', 'mashihani7@gmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'मदेश', 'पर्सा', '', '', ''),
(204, 'डा. नारायण खड्का', '9851076710', 'nkhadka_ktm@hotmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'उदयपुर', '', '', ''),
(205, 'श्री उमा रेग्मी', '9851086892', '', 2, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'चितवन', '', '', ''),
(206, 'श्री जीपछिरिङ लामा', '9851023944', '', 2, NULL, 1, 5, '', 'नेपाल', 'वागमती', 'दोलखा', '', '', ''),
(207, 'श्री सुजाता कोइराला', '9843279980', 'koiralasujata@yahoo.com', 2, NULL, 1, 5, '', 'नेपाल', 'कोशी', 'सुनसरी', '', '', ''),
(208, 'श्री एन.पी. साउद', '9851187912', 'npsauda@gmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम', 'कञ्चनपुर', '', '', ''),
(209, 'श्री जीवनबहादुर शाही', '9851042576', 'jiwanshahi@yahoo.com', 2, NULL, 1, 5, '', 'नेपाल', 'कर्णाली', 'हुम्ला', '', '', ''),
(210, 'श्री आनन्दप्रसाद ढुंगाना', '\n9851166605', 'ncapdhungana@yahoo.com', 2, NULL, 1, 5, '', 'नेपाल', 'मदेश', 'धनुषा', '', '', ''),
(211, 'श्री रमेश लेखक', '9851180333', 'rlekhak54@gmail.com', 2, NULL, 1, 5, '', 'नेपाल', 'सुदुरपश्चिम', 'कञ्चनपुर', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `messageId` int(11) NOT NULL,
  `from` varchar(255) NOT NULL,
  `to` varchar(255) NOT NULL,
  `text` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `positions`
--

CREATE TABLE `positions` (
  `positionId` int(11) NOT NULL,
  `positionName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `positions`
--

INSERT INTO `positions` (`positionId`, `positionName`) VALUES
(1, 'सभापति'),
(2, 'उपसभापति'),
(3, 'महामन्त्री'),
(4, 'सहमहामन्त्री'),
(5, 'सदस्य'),
(6, 'आमन्त्रीत केन्द्रीय सदस्य'),
(7, 'सदस्य एवं प्रवक्ता');

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

--
-- Dumping data for table `structures`
--

INSERT INTO `structures` (`structureId`, `committeeId`, `subCommitteeId`, `levelId`, `positionId`) VALUES
(1, 1, NULL, 1, 1),
(2, 1, NULL, 1, 2),
(3, 1, NULL, 1, 3),
(4, 1, NULL, 1, 4),
(8, 2, NULL, 1, 1),
(9, 2, NULL, 1, 2),
(10, 2, NULL, 1, 3),
(11, 2, NULL, 1, 4),
(14, 1, NULL, 1, 5),
(15, 1, NULL, 1, 6),
(16, 2, NULL, 1, 7);

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
-- Dumping data for table `sub_level`
--

INSERT INTO `sub_level` (`subLevelId`, `committeeId`, `subCommitteeId`, `levelId`) VALUES
(1, 1, NULL, 1),
(2, 2, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userId` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('superadmin','admin') NOT NULL,
  `credits` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userId`, `username`, `password`, `role`, `credits`) VALUES
(1, 'admin', '$2a$12$sYjEEENt4GN2dzqXYtXvc.LJ0HX6M7Ut27QzvDUAD9e5kJKZaqKQK', 'admin', 1106),
(2, 'superadmin', '$2a$12$TMCDaWJrCOQEAkhflBwqqu.eJ2EPURw0R.UDblF8h7bYrMw8ZuQDu', 'superadmin', NULL),
(3, 'tester', 'tester123', 'superadmin', 2000);

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
  ADD PRIMARY KEY (`eventId`);

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
  ADD UNIQUE KEY `memberId` (`memberId`),
  ADD KEY `FK_2df21a5e1e26fb4ae075d7f4e02` (`levelId`),
  ADD KEY `FK_3742c617bc0dc5b4dcdaf58bb93` (`positionId`),
  ADD KEY `FK_ab3f49544a5145ad1184c32cf29` (`subCommitteeId`),
  ADD KEY `FK_92c3822efd1cdb1e2b17e20ea70` (`committeeId`);
ALTER TABLE `members` ADD FULLTEXT KEY `IDX_86b2cd05f01856857cb79a7256` (`mobileNumber`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`messageId`);

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
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `committees`
--
ALTER TABLE `committees`
  MODIFY `committeeId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `eventId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `levels`
--
ALTER TABLE `levels`
  MODIFY `levelId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `memberId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `messageId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `positions`
--
ALTER TABLE `positions`
  MODIFY `positionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `representatives`
--
ALTER TABLE `representatives`
  MODIFY `representativesId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `structures`
--
ALTER TABLE `structures`
  MODIFY `structureId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `sub_committees`
--
ALTER TABLE `sub_committees`
  MODIFY `subCommitteeId` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sub_level`
--
ALTER TABLE `sub_level`
  MODIFY `subLevelId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

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
