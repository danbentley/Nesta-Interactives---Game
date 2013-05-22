require.config({
    paths: {
        'jquery': 'lib/jquery.min'
    }
});

require(['app', 'game'], function(app, game) {
    game.init(app);
});
