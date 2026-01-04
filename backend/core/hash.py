from security import  verify_password , hash_password
password = hash_password("1234")
print("Hashed password:", password)
is_valid = verify_password("1234", password)
print("Password is valid:", is_valid)