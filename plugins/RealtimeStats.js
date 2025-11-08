/**
 * @meta
 * @name RealtimeStats
 * @author iamvany30
 * @version 1.0.0
 * @description Добавляет виджет на главный экран, показывающий количество заблокированных доменов за последние 24 часа.
 * @source https://github.com/iamvany30/agro-block-lists/plugins/RealtimeStats.js
 */

module.exports = class RealtimeStats {
    constructor(pluginAPI, pluginData) {
        this.pluginAPI = pluginAPI;
        this.pluginData = pluginData;
        this.widget = null; 
    }

    start() {
        console.log(`[${this.pluginData.name}] Запущен!`);

        this.widget = document.createElement("div");
        this.widget.className = "realtimestats-widget";
        this.widget.innerHTML = `
            <h4>Статистика за 24 часа</h4>
            <div class="stat-line">
                <span>Заблокировано:</span>
                <span class="stat-value loading">Загрузка...</span>
            </div>
        `;

        this.pluginAPI.ui.addDashboardWidget(this.widget);
        this.pluginAPI.events.on('stats-updated', this.onStatsUpdate.bind(this));
        this.pluginAPI.backend.get24hStats().then(stats => {
            this.updateWidget(stats.blocked);
        });
    }

    stop() {
        console.log(`[${this.pluginData.name}] Остановлен!`);
        this.pluginAPI.ui.removeDashboardWidget(this.widget);
        this.widget = null;
        this.pluginAPI.events.off('stats-updated', this.onStatsUpdate.bind(this));
    }

    onStatsUpdate(newData) {
        if (newData && newData.blocked24h) {
            this.updateWidget(newData.blocked24h);
        }
    }

    updateWidget(count) {
        if (this.widget) {
            const valueEl = this.widget.querySelector('.stat-value');
            valueEl.classList.remove('loading');
            valueEl.textContent = count.toLocaleString('ru-RU');
        }
    }
};
