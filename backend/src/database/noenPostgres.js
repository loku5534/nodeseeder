import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();

class NeonPostgres {
    static instance;

    constructor() {
        if (NeonPostgres.instance) {
            return NeonPostgres.instance;
        }
        this.sql = neon(process.env.DATABASE_URL);
        NeonPostgres.instance = this;
    }

    getSql() {
        return this.sql;
    }
}

export default new NeonPostgres();