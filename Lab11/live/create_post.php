<!DOCTYPE html>
<html lang="ru">
    <head>
        <meta charset="UTF-8">
        <title>Создать пост</title>
    </head>
    <body>
        <form action="api.php?act=uploader" enctype="multipart/form-data" method="POST">
            <div>
                <label>Название</label>
                <input type="text" name="title" required />
            </div>
            <div>
                <label>Картинка</label>
                <input type="file" name="image" accept=".png" required />
            </div>
        </form> 
    </body>
</html>