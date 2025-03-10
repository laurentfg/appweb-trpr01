<script setup lang="ts">
import { ref } from "vue";
import DndItemsSale from "./DndItemsSale.vue";
import type { DndItem } from "../scripts/dndItem";
import { Notivue, Notification, push } from "notivue";

// defineProps<{ msg: string }>()

//solution de id suggéré par ChatGPT (voir formulaire de création d'item)
let idCounter = ref(5);
//variable de recherche créé par ChatGPT
let searchQuery = ref('');

const showDndItemDetails = ref(0);

let DndItemsList = ref<DndItem[]>([
    {
        id: 1,
        name: "potion",
        effect: "guérison",
        quantity: 5,
        price: 2,
        image: undefined,
    },
    {
        id: 2,
        name: "épée",
        effect: "permet d'attaquer",
        quantity: 2,
        price: 10,
        image: undefined,
    },
    {
        id: 3,
        name: "bouclier",
        effect: "permet de se protéger",
        quantity: 1,
        price: 8,
        image: undefined,
    },
    {
        id: 4,
        name: "bottes de vitesse",
        effect: "augmente la vitesse de déplacement",
        quantity: 0,
        price: 25,
        image: undefined,
    },
]);

function removeDndItem(id: number) {
    DndItemsList.value = DndItemsList.value.filter(
        (DndItem) => DndItem.id !== id
    );
    isModifyHidden.value = true;
}

/*
(1)section Script de la requête:form "ajouter un item" ci-dessous créé par ChatGPT avec la requête:
«requête, je veux avoir un formulaire HTML intégré à Vue qui permet d'entrer un produit "dndItem.ts" avec ces attributs:

	export interface DndItem{
		id: number
		name: string
		effect: string
		quantity: number
		image: string | undefined
	}»

	avec une deuxième de requête de "le id doit être autogénéré"*/

const newDndItem = ref<DndItem>({
    id: idCounter.value,
    name: "",
    effect: "",
    quantity: 1,
    price: 0,
    image: undefined,
});

const submitNewDndItem = () => {
    DndItemsList.value.push(newDndItem.value);
    idCounter.value++;
    newDndItem.value = {
        id: idCounter.value,
        name: "",
        effect: "",
        quantity: 1,
        price: 0,
        image: undefined,
    };
};

//fin section (1) généré pour la création d'un item

//La modification ci-dessous est inspiré du code ChatGPT ci-dessus

var isModifyHidden = ref(true);
const modifyDndItem = ref<DndItem>({
    id: idCounter.value,
    name: "",
    effect: "",
    quantity: 1,
    price: 0,
    image: undefined,
});
const startModifyDndItem = (id: number) => {
    isModifyHidden.value = false;
    modifyDndItem.value = {
        id: DndItemsList.value.find((dndItem) => dndItem.id === id)!.id,
        name: DndItemsList.value.find((dndItem) => dndItem.id === id)!.name,
        effect: DndItemsList.value.find((dndItem) => dndItem.id === id)!.effect,
        quantity: DndItemsList.value.find((dndItem) => dndItem.id === id)
            ?.quantity,
        price: DndItemsList.value.find((dndItem) => dndItem.id === id)!.price,
        image: DndItemsList.value.find((dndItem) => dndItem.id === id)?.image,
    };
};
const submitModifyDndItem = () => {
    const tempItem = DndItemsList.value.find(
        (dndItem) => dndItem.id === modifyDndItem.value.id
    );
    if (tempItem) {
        tempItem.name = modifyDndItem.value.name;
        tempItem.effect = modifyDndItem.value.effect;
        tempItem.quantity = modifyDndItem.value.quantity;
        tempItem.price = modifyDndItem.value.price;
        tempItem.image = modifyDndItem.value.image;
    }
    isModifyHidden.value = true;
};

//était supposé être dans son propre .vue, mais j'avais un trouble auquel je ne savais pas comment régler
//pour faire l'importation/exportation entre les deux fichiers
//solution inspirée de cette page: https://stackoverflow.com/questions/58292771/downloading-a-csv-of-file-using-vue-and-js
function exportDndItemsToCsvTable(list: DndItem[]) {
    let csv = "id,name,effect,quantity,price,image_url\n";
    list.forEach((row) => {
        csv += row.id.toString() + ",";
        csv += row.name.toString() + ",";
        csv += row.effect.toString() + ",";
        csv += row.quantity?.toString() + ",";
        csv += row.price?.toString() + ",";
        csv += row.image?.toString() + ",";
        csv += "\n";
    });

    const anchor = document.createElement("a");
    anchor.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    anchor.target = "_blank";
    anchor.download = "DndItemsShop.csv";
    anchor.click();
}

document.addEventListener("DOMContentLoaded", function () {
    checkIfAnyStocksEmpty();
});

function checkIfAnyStocksEmpty() {
    DndItemsList.value.forEach((item) => {
        if (item.quantity == null || item.quantity <= 0) {
            push.warning(
                "l'item: \"" + item.name + '" est en rupture de stock!'
            );
        }
    });
}

function duplicateItemToAddForm(id: number) {
    newDndItem.value = {
        id: idCounter.value,
        name: DndItemsList.value.find((dndItem) => dndItem.id === id)!.name,
        effect: DndItemsList.value.find((dndItem) => dndItem.id === id)!.effect,
        quantity: DndItemsList.value.find((dndItem) => dndItem.id === id)
            ?.quantity,
        price: DndItemsList.value.find((dndItem) => dndItem.id === id)!.price,
        image: DndItemsList.value.find((dndItem) => dndItem.id === id)?.image,
    };
}

//même si la partie HTML a été générée par ChatGPT, j'ai fais cette fonction moi-même
const filteredSearch = () => {
	return DndItemsList.value.filter(data => data.name.toLowerCase().includes(searchQuery.value.toString().toLowerCase()) ||
	data.effect.toLowerCase().includes(searchQuery.value.toString().toLowerCase()));
};
</script>

<template>
    <div>
        <button
            type="button"
            class="btn btn-info"
            v-on:click="exportDndItemsToCsvTable(DndItemsList)"
            v-bind:class="{}"
        >
            Exporter en CSV
        </button>
    </div>
	<p></p>

    <!-- form "ajouter un item" ci-dessous créé par ChatGPT avec la requête:
 «requête, je veux avoir un formulaire HTML intégré à Vue qui permet d'entrer un produit "dndItem.ts" avec ces attributs:
    
    export interface DndItem{
        id: number
        name: string
        effect: string
        quantity: number
        image: string | undefined
    }»
    
    avec une deuxième de requête de "le id doit être autogénéré"
  -->
    <form
        @submit.prevent="submitNewDndItem"
        class="p-4 border rounded bg-light"
    >
        <div class="mb-3">
            <label for="id" class="form-label">ID</label>
            <input
                type="number"
                :value="newDndItem.id"
                class="form-control"
                disabled
            />
        </div>

        <div class="mb-3">
            <label for="name" class="form-label">Nom</label>
            <input
                type="text"
                id="name"
                v-model="newDndItem.name"
                class="form-control"
                required
            />
        </div>

        <div class="mb-3">
            <label for="effect" class="form-label">Effet</label>
            <textarea
                id="effect"
                v-model="newDndItem.effect"
                class="form-control"
                rows="3"
                required
            ></textarea>
        </div>

        <div class="mb-3">
            <label for="quantity" class="form-label">Quantité</label>
            <input
                type="number"
                id="quantity"
                v-model.number="newDndItem.quantity"
                class="form-control"
                min="1"
                required
            />
        </div>

        <div class="mb-3">
            <label for="price" class="form-label">Prix</label>
            <input
                type="number"
                id="price"
                v-model.number="newDndItem.price"
                class="form-control"
                min="0"
                required
            />
        </div>

        <div class="mb-3">
            <label for="image" class="form-label">URL de l'image</label>
            <input
                type="text"
                id="image"
                v-model="newDndItem.image"
                class="form-control"
            />
        </div>

        <button type="submit" class="btn btn-success">
            Ajouter le produit
        </button>
    </form>
    <!--  fin de la section "ajouter un item" généré par ChatGPT  -->

    <form
        @submit.prevent="submitModifyDndItem"
        v-show="!isModifyHidden"
        class="p-4 border rounded bg-dark"
    >
        <div class="mb-3">
            <label for="id" class="form-label">ID</label>
            <input
                type="number"
                :value="modifyDndItem.id"
                class="form-control"
                disabled
            />
        </div>

        <div class="mb-3">
            <label for="name" class="form-label">Nom</label>
            <input
                type="text"
                id="name"
                v-model="modifyDndItem.name"
                class="form-control"
                required
            />
        </div>

        <div class="mb-3">
            <label for="effect" class="form-label">Effet</label>
            <textarea
                id="effect"
                v-model="modifyDndItem.effect"
                class="form-control"
                rows="3"
                required
            ></textarea>
        </div>

        <div class="mb-3">
            <label for="quantity" class="form-label">Quantité</label>
            <input
                type="number"
                id="quantity"
                v-model.number="modifyDndItem.quantity"
                class="form-control"
                min="1"
                required
            />
        </div>

        <div class="mb-3">
            <label for="price" class="form-label">Prix</label>
            <input
                type="number"
                id="price"
                v-model.number="modifyDndItem.price"
                class="form-control"
                min="0"
                required
            />
        </div>

        <div class="mb-3">
            <label for="image" class="form-label">URL de l'image</label>
            <input
                type="text"
                id="image"
                v-model="modifyDndItem.image"
                class="form-control"
            />
        </div>

        <button type="submit" class="btn btn-warning">
            Modifier le produit
        </button>
    </form>
	
    <p></p>
    <p></p>
    <!--bouton de recherche généré par ChatGPT, requête:
	«j'ai besoin d'un champ de recherche, alors j'aimerais avoir la forme HTML de ça» -->
    <div class="input-group mb-3">
        <input
            type="text"
            class="form-control"
            placeholder="Rechercher un item"
            aria-label="Recherche"
            v-model="searchQuery"
        />
    </div>
    <ul class="list-group" v-if="DndItemsList.length">
        <DndItemsSale
            v-for="dndItem in filteredSearch()"
            :key="dndItem.id"
            :dndItem="dndItem"
            :onDelete="removeDndItem"
            :onDetails="showDndItemDetails"
            :onModify="startModifyDndItem"
            :onDuplicate="duplicateItemToAddForm"
        />
    </ul>
    <Notivue v-slot="item">
        <Notification :item="item" />
    </Notivue>
</template>

<style scoped>
.read-the-docs {
    color: #888;
}
</style>
