/* Import the SDK. */
const { connect, Environment } = require('@verafide/sdk'); 

class App {
    constructor () {
        /* Instantiate the SDK client. */
        this.client = connect(Environment.TEST); 

        /* Run examples. */
        (async () => {
            // Login to Verafide
            await this.login();

            // List credentials owned 
            await this.credentials();

            // Present an owned credential
            await this.presentation();

            // Make a credential request
            await this.createVcRequest();

            process.exit(1);
        })();
    }

    /**
     * Does a login, authenticating us with the chosen Verafide system.
     */
    async login () {
        // Do our login.
        try {
            const login = await this.client.login(
                'username',
                'password',
            );
            console.log('login: ', login);
        } catch (e) {
            console.error('Failed to login')
        }
        
    }

    /**
     * Fetches our credentials, and verifies the first one.
     */
    async credentials () {
        try {
            // Fetch our credentials.
            this.mycredentials = await this.client.ownedVCs();
            console.log('credentials: ', this.mycredentials);

            if (this.mycredentials.length > 0) {
                // Verify our first credential.
                const verify = await this.client.verify(this.mycredentials[0].vc);
                console.log('verify: ', verify);
            } else {
                console.log('no credentials found');
            }
        } catch (e) {
            console.error('Failed to login')
        }
    }

    /**
     * Creates a new presentation, signs it and updates it. All while checking the current state throughout.
     */
    async presentation () {
        
        // Check for credentials
        if(this.mycredentials.length == 0) {
            console.log('no credentials found');
            return;
        }

        // Create a new presentation.
        const presentation = await this.client.newPresentation(this.mycredentials[0].type);
        console.log('presentation: ', presentation);
    
        // Check the presentation state.
        // We would usually wait for the `orgwalletid` and `orglabel` to be set by the vendor.
        // This is done when the vendor receives your presentation token.
        let presentationState;
        presentationState = await this.client.pollPresentation(presentation.token);
        console.log('presentationState: ', presentationState);
    
        // Sign our first VC ready for the presentation.
        const signedVC = await this.client.signPresentation(this.mycredentials[0].vc);
        console.log('signedVC: ', signedVC);
    
        // Add the VC to the presentation.
        const updatedPresentation = await this.client.updatePresentation(
            presentation.token,
            signedVC,
            2,
            null,
            null
        );
        console.log('updatedPresentation: ', updatedPresentation);
    
        // Check the presentation state.
        presentationState = await this.client.pollPresentation(presentation.token);
        console.log('presentationState: ', presentationState);
    }

    /**
     * Requests schemas and public DIDs, then creates a VC request using the information we requested.
     */
    async createVcRequest () {
        // Fetch public schemas.
        this.publicschemas = await this.client.allCredentialSchemes();
        console.log('schemas: ', this.publicschemas);
    
        // Fetch public DIDs.
        this.publicDIDs = await this.client.getPublicDIDs();
        console.log('publicDIDs: ', this.publicDIDs);
    

        // Get a random schema.
        const schema = this.publicschemas
            .find(s => !!s.data.issuers[0]); // Find a schema with issuers.
        
        // Build a schema object from fields.
        const vcData = {};
        schema.data.fields.map((field) => {
            vcData[field] = 'example';
        });

        // Get Issuer walletID.
        const issuerDidInfo = this.publicDIDs
            .find(d => d.did === schema.data.issuers[0]);
    
        // Do the schema request.
        const vcRequest = await this.client.saveRequestToSign(
            vcData,
            schema.typeDefinition,
            issuerDidInfo.walletid,
            "request",
            schema.id,
            true
        );
        console.log('vcRequest: ', vcRequest);
    }
}

const app = new App();