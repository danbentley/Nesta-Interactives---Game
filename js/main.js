require.config({
    paths: {
        'jquery': 'lib/jquery.min',
        'app': 'src/app',
        'game': 'src/game',
        'ball': 'src/ball',
        'paddle': 'src/paddle',
        'config-handler': 'src/config-handler'
    }
});

require(['app', 'game', 'config-handler'], function(app, game, configHandler) {
    game.init(app);
    $(document).ready(function() {
        configHandler.init();
    });
});
