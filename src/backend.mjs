import PocketBase from 'pocketbase' ;
const pb = new PocketBase('http://127.0.0.1:8090') ;

export async function getOffres() {
    try {
        let data = await pb.collection('Maison').getFullList({
            sort: '-created',
        });
        data = data.map((offre) => {
            offre.img = pb.files.getURL(offre, offre.image);
            return offre;
        });
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la liste des maisons', error);
        return null;
    }
}

export async function getOffre(id) {
    try {
        let data = await pb.collection('Maison').getOne(id);
        data.img = pb.files.getURL(data, data.image);
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la maison', error);
        return null;
    }
}


export async function bySurface(s) {
    const surfaceRecord = await pb.collection('Maison').getFullList({ filter : `surface> ${s}`, }) ;
    return surfaceRecord ;
    }


export async function addOffre(house) {
    try {
        await pb.collection('Maison').create(house);
        return {
            success: true,
            message: 'Offre ajoutée avec succès'
        };
    } catch (error) {
        console.log('Une erreur est survenue en ajoutant la maison', error);
        return {
            success: false,
            message: 'Une erreur est survenue en ajoutant la maison'
        };
    }
}

export async function filterByPrix(prixMin, prixMax) {
    try {
        let data = await pb.collection('Maison').getFullList({
            sort: '-created',
            filter: `prix >= ${prixMin} && prix <= ${prixMax}`
        });
        data = data.map((maison) => {
            maison.imageUrl = pb.files.getURL(maison, maison.image);
            return maison;
        });
        return data;
    } catch (error) {
        console.log('Une erreur est survenue en filtrant la liste des maisons', error);
        return [];
    }
}

export async function getAgents() {
    try {
        let data = await pb.collection('Agent').getFullList({
            sort: '-created',
        });

        return data;
    } catch (error) {
        console.log('Une erreur est survenue en lisant la liste des agents', error);
        return null;
    }
}

export async function allMaisonsByAgentId(id) {
    let SortedAgentRecord = await pb.collection('Maison').getFullList({
        filter : `agent_charge.id= '${id}'`,
        expand : 'agent_charge'
    });
    SortedAgentRecord = SortedAgentRecord.map((maison) => {
        maison.img = pb.files.getURL(maison, maison.image);
        return maison;
    });
    return SortedAgentRecord ;
}
