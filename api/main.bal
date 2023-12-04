import ballerina/http;

listener http:Listener httpListener = new (8080);

@http:ServiceConfig {
    cors: {
        allowOrigins: ["http://localhost:4200"],
        // allowOrigins: ["*"],
        // allowHeaders: ["*"],
        allowCredentials: false,
        maxAge: 84900
    }
}

service / on httpListener {
    resource function get users() returns UserResponseDTO[] {
        User[] users = usersTable.toArray();
        UserResponseDTO[] userResponseArray = [];
        
        foreach User user in users {
            UserResponseDTO userResponse = {id: user.id, email: user.email};
            userResponseArray.push(userResponse);
        }
        
        return userResponseArray;
    }

    resource function get users/[int userId]() returns UserResponseDTO|InvalidIdError {
        User? user = usersTable[userId];
        if user is () {
            return {
                body: {
                    errmsg: "Invalid ID"
                }
            };
        }

        return {id: user.id, email: user.email};
    }

    resource function post users(@http:Payload CreatedUserDTO newUserDTO) returns UserResponseDTO | UserExistError {

        boolean userExists = checkUserExists(newUserDTO.email);

        if(userExists) {
            return {
                body: {
                    errmsg: "User already exist"
                }
            };
        }

        int nextUserId = usersTable.length() + 1;

        User newUser = { id: nextUserId, email: newUserDTO.email, password: newUserDTO.password };

        usersTable.add(newUser);

        return {id: newUser.id, email: newUser.email};
    }

    resource function post users/resetPassword(@http:Payload string userEmail) returns http:Accepted|http:BadRequest {
        if(checkUserExists(userEmail)) {
            return http:ACCEPTED;
        } else {
            return http:BAD_REQUEST;
        }
    }

    resource function post auth/login(@http:Payload CreatedUserDTO userToLogin) returns http:Ok|http:Unauthorized {
        if(checkUserPassword(userToLogin.email, userToLogin.password)) {
            return http:OK;
        } else {
            return http:UNAUTHORIZED;
        }
    }
}

function checkUserPassword(string email, string password) returns boolean {
    foreach User user in usersTable {
        if (user.email == email && user.password == password) {
            return true;
        }
    }
    return false;
}

function checkUserExists(string userEmail) returns boolean {
    foreach User user in usersTable {
        if (user.email == userEmail) {
            return true;
        }
    }
    return false;
}

type BadRequestError record {|
    *http:NotFound;
    ErrorMsg body;
|};

type InvalidIdError record {|
    *http:NotFound;
    ErrorMsg body;
|};

type UserExistError record {|
    *http:Conflict;
    ErrorMsg body;
|};

type ErrorMsg record {|
    string errmsg;
|};

type User record {
    readonly int id;
    string email;
    string password;
};

type UserResponseDTO record {
    int id;
    string email;
};

type CreatedUserDTO record {
    string email;
    string password;
};

final table<User> key(id) usersTable = table [
    {id: 1, email: "user1@gmail.com", password: "Password1" },
    {id: 2, email: "user2@gmail.com", password: "Password2" },
    {id: 3, email: "user3@gmail.com", password: "Password3" }
];
