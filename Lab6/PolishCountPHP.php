<?php
function polish_note($input_string) {
    $tokens = explode(' ', $input_string);
    $stack = array();
    
    foreach ($tokens as $token) {
        if (is_numeric($token)) {
            array_push($stack, intval($token));
        } else {
            $b = array_pop($stack);
            $a = array_pop($stack);
            
            switch ($token) {
                case '+':
                    array_push($stack, $a + $b);
                    break;
                case '-':
                    array_push($stack, $a - $b);
                    break;
                case '*':
                    array_push($stack, $a * $b);
                    break;
                
            }
        }
    }
    
    return array_pop($stack);
}

$polish_string = $_POST["polishString"];
echo 'Входные данные ' . $polish_string . "<br>";

echo polish_note($polish_string);

?>