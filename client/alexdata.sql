-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 01, 2020 at 02:36 AM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test2`
--
CREATE DATABASE IF NOT EXISTS `test2` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `test2`;

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `taken` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`taken`) VALUES
('Calculus I'),
('Introduction to Management'),
('Business Law and Ethics'),
('Computer Science I'),
('Introduction to Information Technology and Web Science'),
('Calculus II'),
('Physics I'),
('IT and Society');

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

CREATE TABLE `data` (
  `Major` varchar(100) NOT NULL,
  `Minor` varchar(100) NOT NULL,
  `Concentration` varchar(100) NOT NULL,
  `GPA` decimal(10,0) NOT NULL,
  `name` varchar(100) NOT NULL,
  `classes` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `data`
--

INSERT INTO `data` (`Major`, `Minor`, `Concentration`, `GPA`, `name`, `classes`) VALUES
('Information Technology and Web Science', 'N/A', 'Data Science', '4', '', ''),
('Information Technology and Web Science', 'N/A', 'Data Science', '4', 'Alexandra Mednikova', ''),
('', '', '', '0', '', 'Introduction to Management');

-- --------------------------------------------------------

--
-- Table structure for table `testing`
--

CREATE TABLE `testing` (
  `Major` varchar(100) NOT NULL,
  `Minor` varchar(100) NOT NULL,
  `Concentration` varchar(100) NOT NULL,
  `GPA` decimal(60,0) NOT NULL,
  `Person` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `testing`
--

INSERT INTO `testing` (`Major`, `Minor`, `Concentration`, `GPA`, `Person`) VALUES
('Information Technology and Web Science', 'N/A', 'Data Science', '4', 'Alexandra Mednikova');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
