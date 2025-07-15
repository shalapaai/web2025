<?php 
    $lat = 56.6326;
    $lon = 47.8958;
    $apiKey = "848a0887b195b2fc47237065e973d8a7";
    $cacheFile = 'weather_cache.json'; 
    $cacheTime = 600; 

    // Если кэш существует и не устарел — берём данные из него
    if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTime)) {
        $data = json_decode(file_get_contents($cacheFile), true);
    } 
    // Иначе запрашиваем api и сохраняем в кэш
    else {
        $url = "https://api.openweathermap.org/data/2.5/weather?lat=$lat&lon=$lon&appid=$apiKey&units=metric&lang=ru";
        $response = file_get_contents($url);
        
        if (!$response) {
            die("Ошибка запроса к api");
        }
        
        $data = json_decode($response, true);
        file_put_contents($cacheFile, $response); // Сохраняем в кэш
    }
?>
<!DOCTYPE html>
<html lang="ru">
    <head>
        <title>Dashboard</title>
        <meta charset="UTF-8">
        <link href="style.css" rel="stylesheet">
    </head>
    <body>
        <div class="weather">
            <p class="weather__header">Погода Йошкар-Ола</p>
            <div class="weather__stats">
                <img class="weather__status-image" src="https://openweathermap.org/img/wn/<?php echo $data['weather'][0]['icon'] ?>@2x.png" 
                alt="<?php echo $data['weather'][0]['description']; ?>">
                <div>
                    <p class="weather__temperature"><?php echo round($data['main']['temp']) . "°C" ?></p>
                    <p class="weather__status"><?php echo $data['weather'][0]['description'] ?></p>
                </div>
            </div>
            <div class="weather__dop-info">
                <div>
                    <p>Ощущается как</p>
                    <p><?php echo round($data['main']['feels_like']) . "°C"?></p>
                </div>
                <div>
                    <p>Давление</p>
                    <p><?php echo $data['main']['pressure'] . " мм рт.ст." ?></p>
                </div>
                <div>
                    <p>Влажность</p>
                    <p><?php echo $data['main']['humidity'] . "%" ?></p>
                </div>
                <div>
                    <p>Скорость ветра</p>
                    <p><?php echo $data['wind']['speed'] . ' м/с' ?></p>
                </div>
            </div>
        </div>
        <div class="clock-box">
            <div class="clock">
                <div class="hour">
                    <div class="hours"></div>
                </div>
                <div class="minute">
                    <div class="minutes"></div>
                </div>
                <div class="second">
                    <div class="seconds"></div>
                </div>
            </div>
        </div>

        <div class="calendar-box">
            <div class="calendar">
                <div class="calendar__header">
                    <div class="calendar__month" id="month-year"></div>
                    <div class="calendar__btns">
                        <buttom type="button" class="calendar__btn" id="prev-btn">
                            <img src="images/arrow-left.svg" alt="стрелка влево">
                        </button>
                        <buttom type="button" class="calendar__btn" id="next-btn">
                            <img src="images/arrow-right.svg" alt="стрелка вправо">
                        </button>
                    </div>
                </div>
                <div class="calendar__body">
                    <div class="calendar__day-names">

                    </div>
                    <div class="calendar__days" id="calendar-days">

                    </div>
                </div>
            </div>
        </div>

        <script src="script.js"></script>
    </body>
</html>