<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <style>
            html,
            body {
                width: 100%;
                margin: 0;
                padding: 0;
                background-color: #ededed;
            }
        </style>

        <title>Open Sketch</title>
    </head>
    <body class="antialiased">
        <sketch-manager lang="{{ app()->currentLocale() }}"></sketch-manager>
        @vite(['resources/css/app.css', 'resources/js/src/pages/SketchManager.ts'])
    </body>
</html>
