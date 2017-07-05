const {isEmail, getDomain, getMx, convert, getDomains, sortByDomain, hasError, groupByDomain} = require('./tasks.js')

describe('isEmail', () => {
  test('should validate', () => {expect(isEmail('me@gmail.com')).toBe(true)})
  test('should fail', () => {expect(isEmail('gruberjlgmail.com')).toBe(false)})
})

describe('getDomain', () => {
  test('should get domain', () => {expect(getDomain('me@gmail.com')).toBe("gmail.com")})
})

describe('getMx', () => {
  test('should get mx', () => getMx('gitbit.org').then((results) => {
    expect(results.length).toBe(1)
    expect(results).toContainEqual({"exchange": "gitbit-org.mail.protection.outlook.com", "priority": 10})
  }))

  test('should not have mx records', () => getMx('ugh.gitbit.org').then(null, (err) => {
    expect(err.statusCode).toBe(501)
    expect(err.domain).toBe('ugh.gitbit.org')
  }))
})

describe("convert", () => {
  test('should convert to objects', ()=> {
    const emails = ['a@b.c', 'd@e.f']
    expect(convert(emails)).toContainEqual({email:'a@b.c'})
    expect(convert(emails)).toContainEqual({email:'d@e.f'})
  })
})

describe("getDomains", () => {
  test('should extract domain', () => {
    const objs = [{email:'a@b.c'}, {email:'d@e.f'}]
    getDomains(objs)
    expect(objs).toContainEqual({email:'a@b.c', domain:'b.c'})
    expect(objs).toContainEqual({email:'d@e.f', domain:'e.f'})
  })
})

describe('sortByDomain', () => {
  test('should sort objects by domain', () => {
    const objs = [{email:'d@e.f', domain:'e.f'}, {email:'a@b.c', domain:'b.c'}]
    sortByDomain(objs)
    expect(objs[0]).toEqual({email:'a@b.c', domain:'b.c'})
    expect(objs[1]).toEqual({email:'d@e.f', domain:'e.f'})
  })
})

describe('hasError', () => {
  test('should find errors in objects', () => {
    expect(hasError({email:'a@b.c'})).toBe(false)
    expect(hasError({email:'a@b.c', statusCode:200})).toBe(false)
    expect(hasError({email:'a@b.c', statusCode:400})).toBe(true)
  })
})

describe("groupByDomain", () => {
  test('should group items by domain', () => {
    expect(groupByDomain([{email:'a@b.c', domain:'b.c'}])).toEqual([[{email:'a@b.c', domain:'b.c'}]])

    const objs = [{email:'a@b.c', domain:'b.c'}, {email:'d@e.f', domain:'e.f'}, {email:'g@e.f', domain:'e.f'}]
    const groups = [[{email:'a@b.c', domain:'b.c'}], [{email:'d@e.f', domain:'e.f'}, {email:'g@e.f', domain:'e.f'}]]
    expect(groupByDomain(objs)).toEqual(groups)
  })
})
