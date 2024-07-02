<?php
if (isset($_FILES['excelFile'])) {
    $file = $_FILES['excelFile']['tmp_name'];

    require 'vendor/autoload.php';
    use PhpOffice\PhpSpreadsheet\IOFactory;

    $spreadsheet = IOFactory::load($file);
    $sheetData = $spreadsheet->getActiveSheet()->toArray();

    $host = 'localhost';
    $db = 'your_database';
    $user = 'your_username';
    $pass = 'your_password';

    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    foreach ($sheetData as $row) {
        $sql = "INSERT INTO your_table (column1, column2, column3) VALUES ('$row[0]', '$row[1]', '$row[2]')";
        $conn->query($sql);
    }

    $conn->close();
    echo "File uploaded and data inserted successfully.";
} else {
    echo "No file uploaded.";
}
?>
