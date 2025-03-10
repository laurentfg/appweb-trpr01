<script setup lang="ts">
import {ref, defineProps} from "vue";
import type {DndItem} from '../scripts/dndItem.ts';

const dndItemShowDetails = ref(0);

defineProps<{
dndItem: DndItem;
    onDelete: (id: number) => void;
    onDetails: number;
    onModify: (id: number) => void;
    onDuplicate: (id: number) => void;
}>();


function onDetailsChange (id: number){
    if (dndItemShowDetails.value == id){
        dndItemShowDetails.value = 0;
    } else{
        dndItemShowDetails.value = id;
    }
}
</script>

<template>
    <li class="list-group-item">
        <div>
            <h1>
                {{ dndItem.name }}
            </h1>
            <div
            :style="{'color': (dndItem.quantity != null && dndItem.quantity>0) ? 'green':'red'} ">
                quantity: {{ dndItem.quantity }}
            </div>
            <h2 v-show="dndItem.id === dndItemShowDetails.valueOf()">
                <p></p>
                prix: {{dndItem.price}}
                <p></p>
                effet: {{dndItem.effect}}
                <p></p>
            </h2>
        </div>
        <div>
            <button @click="onDetailsChange(dndItem.id)" class="btn btn-sm btn-primary">
                Détails
            </button>
            <button @click="onDuplicate(dndItem.id)" class="btn btn-sm btn-outline-primary">
                Dupliquer
            </button>
            <button @click="onModify(dndItem.id)" class="btn btn-sm btn-outline-warning">
                Modifier
            </button>
            <button @click="onDelete(dndItem.id)" class="btn btn-sm btn-outline-danger">
                supprimer
            </button>
        </div>
    </li>
</template>