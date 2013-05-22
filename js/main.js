require.config({
    paths: {
        'jquery': 'lib/jquery.min',
        'app': 'src/app',
        'game': 'src/game',
        'ball': 'src/ball',
        'paddle': 'src/paddle'
    }
});

require(['app', 'game'], function(app, game) {
    game.init(app);
});
