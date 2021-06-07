export class Level1prob {
    
    public static getProbs(): number[][][] {
        // [Westen, Norden, Osten, Süden]

        /* Erfolgspfad
        Der Erfolgspfad verläuft nicht mehr geradelinig, sondern eher schlangenlinienformig.
        Ich selbst habe es mehrere Stunden getestet (im Kopf, die Wahrscheinlichkeiten werden vom Level
        noch nicht gelesen) und habe festgestellt, dass dieser Pfad sehr herausfordernd ist. Zumal
        eine Bestrafung fehlt, wird dieses (eher kleines) Level sehr schnell komplex. Ein 
        verzweifelter Rush ist hiermit nicht mehr möglich. Die Zahl im Feld symbolisiert die 
        Anzahl von Aliens, die in die entsprechende Richtung aufgeteilt werden. Vermeintliche
        Abkürzungen werden mit sehr sehr hohen Splits bestraft.
        */

        //WE WILL PROBABLY DON'T NEED IT ANYMORE
        const probs: number[][][] = null;

        probs[16][3] = [0,0,0,0];
        probs[17][3] = [0,0,0,0];
        probs[17][4] = [0,0,0,0];
        probs[17][5] = [0,0,0,0];
        probs[16][5] = [0,0,0,0];
        probs[15][5] = [0,0,0,0];
        probs[14][5] = [0,0,0,0];
        probs[14][6] = [0,0,0,0];
        probs[13][6] = [0,0,0,0];
        probs[12][6] = [0,0,0,0];
        probs[12][5] = [0,0,0,0];
        probs[12][4] = [0,0,0,0];
        probs[11][4] = [0,0,0,0];
        probs[11][3] = [0,0,0,0];
        probs[10][3] = [0,0,0,0];
        probs[9][3] = [0,0,0,0];
        probs[9][4] = [0,0,0,0];
        probs[9][5] = [0,0,0,0];
        probs[8][5] = [0,0,0,0];
        probs[8][6] = [0,0,0,0];
        probs[9][6] = [0,0,0,0];
        probs[10][6] = [0,0,0,0];
        probs[10][7] = [0,0,0,0];
        probs[10][8] = [0,0,0,0];
        probs[11][8] = [0,0,0,0];
        probs[12][8] = [0,0,0,0];
        probs[9][8] = [0,0,0,0];
        probs[8][8] = [0,0,0,0];
        probs[7][8] = [0,0,0,0];

        // Gelb = 1, Orange = 2, Rot = 4
        // (Summe der Feldelemente)
        probs[14][3] = [0,0,1,1]; // (hier z.B. Orange)
        probs[15][3] = [0,0,1,0]; // (hier z.B. Gelb)
        probs[14][4] = [1,1,1,1]; // (hier z.B. Rot)
        probs[15][4] = [1,1,1,1];
        probs[16][4] = [1,0,0,1];
        
        probs[16][6] = [0,1,0,1];
        probs[17][6] = [0,1,0,1];
        probs[16][7] = [0,1,0,1];
        probs[17][7] = [0,1,0,1];
        probs[16][8] = [0,2,0,2];
        probs[15][8] = [2,0,2,0];
        probs[14][8] = [2,0,2,0];
        probs[13][8] = [2,0,2,0];
        
        probs[13][5] = [1,1,1,1];
        probs[13][5] = [1,0,1,2];
        probs[12][3] = [0,0,0,2];
        probs[12][3] = [1,0,0,1];
        probs[10][4] = [0,0,0,2];
        probs[10][5] = [0,1,0,0];
        probs[10][5] = [0,1,0,0];
        probs[8][3] = [0,0,1,0];
        probs[8][4] = [0,1,0,0];
        probs[9][7] = [0,1,0,0];
        probs[8][7] = [0,2,2,0];
        probs[7][7] = [0,0,0,1];

        return probs;
    }
}
