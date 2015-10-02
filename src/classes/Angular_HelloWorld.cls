public class Angular_HelloWorld {
    public static String getContactListJSON() {
        List<ContactWrapper> contactWrapper = new List<ContactWrapper>();
        for (Contact contactInstance : [SELECT Id, Name, FirstName, LastName, Phone FROM Contact ORDER BY CreatedDate LIMIT 5]) {
            contactWrapper.add(
                new ContactWrapper(
                    contactInstance.firstName,
                    contactInstance.lastName,
                    contactInstance.Id,
                    contactInstance.Phone
                )
            );
        }
        return JSON.serialize(contactWrapper);
    } 

    @RemoteAction
    public static String upsertContact(Contact contactInstance) {
        System.debug('contactInstance-->' + contactInstance);
        upsert contactInstance;

        return JSON.serialize(
            new ContactWrapper(
                contactInstance.firstName,
                contactInstance.lastName,
                contactInstance.Id,
                contactInstance.phone
            )
        );
    }

    @RemoteAction
    public static void deleteContact(String contactIdToDelete) {
        delete [SELECT Id FROM Contact WHERE Id =: contactIdToDelete];
    }

    public class ContactWrapper {
        public String firstName;
        public String lastName;
        public String id;
        public String phone;
        public ContactWrapper(String firstName, String lastName, String id, String phone) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.id = id;
            this.phone = phone;
        }
    }
}