class AcGameMenu{
    constructor(root){
        this.root = root;
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-single">
            单人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-multi">
            多人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-settings">
            设置
        </div>
    </div>
</div>
        `);
        this.root.$ac_game.append(this.$menu);
        this.$single = $menu.find('.ac-game-menu-field-single');
        this.$multi = $menu.find('.ac-game-menu-field-multi');
        this.$settings = $menu.find('.ac-game-menu-field-settings');
    }
}
