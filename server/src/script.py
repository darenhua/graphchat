from factory import Factory

if __name__ == "__main__":
    factory = Factory()
    dataCreator = factory.create_datacreator()
    print(dataCreator.publishData(500))
    print(dataCreator.subfields)
