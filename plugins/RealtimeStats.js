/**
 * @meta
 * @name RealtimeStats
 * @author iamvany30
 * @version 1.0.0
 * @description Добавляет виджет на главный экран, показывающий количество заблокированных доменов за последние 24 часа.
 * @source https://github.com/iamvany30/agro-block-lists/blob/main/plugins/RealtimeStats.js
 */

module.exports = class RealtimeStats {
    constructor(pluginAPI, pluginData) {
        this.api = pluginAPI;
        this.plugin = pluginData;
        this.widget = null;
        this.eventListener = this.onStatsUpdate.bind(this);
    }

    start() {
        this.api.utils.log("Плагин запущен.");

        this.widget = this.api.utils.createElement(`
            <div class="realtimestats-widget" style="background-color: #3a4049; padding: 15px; border-radius: 8px; margin-top: 20px; width: 100%; max-width: 600px;">
                <h4 style="margin: 0 0 10px 0; color: #ffffff; border-bottom: 1px solid #555; padding-bottom: 10px;">Статистика за 24 часа</h4>
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: 1.2em;">
                    <span style="color: #a0aec0;">Заблокировано доменов:</span>
                    <span class="stat-value" style="color: #4caf50; font-weight: bold;">Загрузка...</span>
                </div>
            </div>
        `);
        
        const dashboard = document.querySelector('.dashboard-main');
        if (dashboard) {
            dashboard.appendChild(this.widget);
        } else {
             this.api.utils.log("Не удалось найти .dashboard-main для добавления виджета.");
        }

        this.api.events.on('backend-status-update', this.eventListener);
        
        this.api.data.getBackendStatus()
            .then(status => this.onStatsUpdate(status))
            .catch(err => this.api.utils.log("Ошибка получения первоначального статуса:", err));
    }

    stop() {
        this.api.utils.log("Плагин остановлен.");

        if (this.widget) {
            this.widget.remove();
            this.widget = null;
        }

        this.api.events.off('backend-status-update', this.eventListener);
    }

    onStatsUpdate(status) {
        const blocked24h = status?.stats?.total_blocked || 0; 
        this.updateWidget(blocked24h);
    }

    updateWidget(count) {
        if (this.widget) {
            const valueEl = this.widget.querySelector('.stat-value');
            if (valueEl) {
                valueEl.textContent = count.toLocaleString('ru-RU');
            }
        }
    }
};
