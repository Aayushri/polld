-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 27, 2022 at 07:36 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zebucoin`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `name` varchar(200) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `image` varchar(250) DEFAULT NULL,
  `country_id` int(11) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `name`, `email`, `password`, `image`, `country_id`, `created_date`) VALUES
(1, 'admin', 'admin@gmail.com', '$2a$10$wkeKiqJnr5uebjJgSnDzVeGFx4YrZHwz8dk1xNtPP03F/IzK.OVcm', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

CREATE TABLE `transaction` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL DEFAULT 0,
  `description` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL,
  `modified_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`id`, `user_id`, `amount`, `description`, `created_at`, `modified_at`) VALUES
(1, 3, 100, 'Amount Transfered By Admin', '2022-08-26 08:17:53', '2022-08-26 08:17:53'),
(2, 3, 100, 'Amount Transfered By Admin', '2022-08-26 08:20:12', '2022-08-26 08:20:12'),
(3, 2, 100, 'Amount Transfered By Admin', '2022-08-26 08:20:21', '2022-08-26 08:20:21'),
(4, 4, 150, 'Amount Transfered By Admin', '2022-08-26 10:35:11', '2022-08-26 10:35:11'),
(5, 5, 500, 'Amount Transfered By Admin', '2022-08-26 10:43:43', '2022-08-26 10:43:43'),
(6, 6, 350, 'Amount Transfered By Admin', '2022-08-26 10:58:38', '2022-08-26 10:58:38');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `contact` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `wallet` int(11) NOT NULL DEFAULT 0,
  `otp` int(11) NOT NULL DEFAULT 0,
  `created_date` datetime NOT NULL,
  `modified_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `contact`, `email`, `password`, `wallet`, `otp`, `created_date`, `modified_date`) VALUES
(1, 'Aayushri', '7897897897', 'deepak@gmail.com', '$2a$10$OurF4ewv8iCIQhYYkF.ztewQmgMtAdrSDgyFEVIDRWMcyJkg6Cr22', 0, 0, '2022-08-25 18:23:38', '2022-08-26 10:41:48'),
(2, 'Shri', '7897897898', 'shri@gmail.com', '$2a$10$6bbY0xhhQClBYQ0EySo8AOtkc4t9mB1os4YAr7I.XzzLqIZB.Kmqe', 100, 0, '2022-08-25 19:33:30', '2022-08-26 08:20:20'),
(3, 'Aayushri', '7987987654', 'Shah@gmail.com', '$2a$10$nuVWgCkxwZvvb.o00aM3OeHPLVTqC.nw792GB1GfereeGEIUfypw2', 350, 0, '2022-08-25 19:41:57', '2022-08-26 08:20:12'),
(4, 'Mayank', '9879879879', 'mayank@gmail.com', '$2a$10$Q9/U8LGKbDcf5Z7fJMbYxOZIgc093ngSn6/DOT85dXzWR8RU/jyva', 150, 0, '2022-08-26 10:33:13', '2022-08-26 10:35:10'),
(5, 'Aayushri', '7936545454', 'shah@gmail.com', '$2a$10$gEyiZScCK13rXuOU8INYCuPdmAN3uxAQAZXlrqK.4/WQncvdqN.LO', 500, 0, '2022-08-26 10:42:54', '2022-08-26 10:53:29'),
(6, 'Aayushri', '798798798', 'aayushri.shah@gmail.com', '$2a$10$Mc2B5LlZI3VaDFErNveLXusaHc6xRE2B1VTk5ozhPplrEP9Cn0sMm', 350, 0, '2022-08-26 10:57:56', '2022-08-26 11:00:21');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transaction`
--
ALTER TABLE `transaction`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `transaction`
--
ALTER TABLE `transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
