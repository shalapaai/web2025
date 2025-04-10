<?php
function time_ago($timestamp) {
    $current_time = time();
    $time_diff = $current_time - $timestamp;

    if ($time_diff < 60) {
        return 'только что';
    } elseif ($time_diff < 3600) {
        $mins = floor($time_diff / 60);
        return "$mins минут назад";
    } elseif ($time_diff < 86400) {
        $hours = floor($time_diff / 3600);
        return "$hours часов назад";
    } else {
        $days = floor($time_diff / 86400);
        return "$days дней назад";
    }
}
?>