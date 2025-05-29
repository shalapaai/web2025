<?php
function polish_note($input) {
    $elements = explode(' ', $input);
    $stack = array();
    
    foreach ($elements as $element) {
        if (is_numeric($element)) {
            array_push($stack, intval($element));
        } else {
            $b = array_pop($stack);
            $a = array_pop($stack);
            
            switch ($element) {
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