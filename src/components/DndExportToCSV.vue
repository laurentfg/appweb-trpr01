<script setup lang="ts">
import {defineProps} from "vue";
import type {DndItem} from '../scripts/dndItem.ts';

export function ExportDndItemsToCsvTable(list: DndItem[]) {
    let csv = 'id, name, effect, quantity, image_url\n';
    list.forEach((row) => {
        csv += row.id.toString()+(',');
        csv += row.name.toString()+(',');
        csv += row.effect.toString()+(',');
        csv += row.quantity?.toString()+(',');
        csv += row.image?.toString()+(',');
    });
    
    const anchor = document.createElement('a');
    anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    anchor.target = '_blank';
    anchor.download = 'DndItemsShop.csv';
    anchor.click();
}



</script>